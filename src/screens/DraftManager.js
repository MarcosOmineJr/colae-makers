import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import {
    Textarea
} from 'native-base';
import { connect } from 'react-redux';
import ColaeAPI from '../api';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const { ColUI } = ColaeAPI;

const { width, height } = Dimensions.get('screen');

const GridWidth = (colSpan)=>((width*0.1027)*colSpan)+((width*0.055)*(colSpan-1));

//================================================================================================

class ProcessDraft extends React.Component {

    constructor(props){
        super(props);
        this._isDraftCreated = this._isDraftCreated.bind(this);
    }

    componentDidMount(){
        this._isDraftCreated();
    }

    _isDraftCreated(){
        if(this.props.tempDraft == null){
            this.props.navigation.navigate('CreateTempDraft');
        } else {
            this.props.navigation.navigate('DraftProgress', { mode: 'temp' });
        }
    }

    render(){
        return (
            <View style={ProcessDraftStyles.container}>
                <ActivityIndicator size='large' color={this.props.ColUITheme.main} />
            </View>
        );
    }
}

const ProcessDraftStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

//================================================================================================

class DraftProgress extends React.Component {
    constructor(props){
        super(props);
        this.state = {

            //Estado dos dados que serão carregados no step:
            stepData: [
                {routename: 'EventType', fields: ['template'], description: 'Tipo de Evento', done: false},
                {routename: 'EventDescription', fields: ['description'], description: 'Descrição do Evento', done: false},
                {routename: 'EventDate', fields: ['dates', 'locale', 'duration'], description: 'Data, local e horário', done: false},
                {routename: 'EventSchedule', fields:['schedule'], description: 'Programação (opcional)', done: false},
                {routename: 'EventTickets', fields:['tickets'], description: 'Ingressos', done: false},
                {routename: 'EventProducts', fields: ['products'], description: 'Produtos', done: false},
                {routename: 'EventServices', fields:['services'], description: 'Serviços', done: false}
            ],
            draft: {}
        }
        this._saveAsDraft = this._saveAsDraft.bind(this);
        this._isMounted = false;
        this._cleanTempDraft = this._cleanTempDraft.bind(this);
    }

    //Propriedade inicialmente vazia:
    _docRef = '';

    componentDidMount(){
        this._isMounted = true;
        //Setando o this._draft usando o id do evento para pegar as informações do firestore:
        if(this.props.tempDraft == null){
            //Se tempDraft for null, ele pega o id do navigation.state.params e seta um tempDraft para unificar as informações do rascunho:

            let unsubscribe = firebase.firestore().doc('events/'+this.props.navigation.getParams('draftId', 'NO-ID')).onSnapshot({
                error: e=>console.error('erro ao pegar rascunho do firestore:', e),
                next: QuerySnapshot=>{
                    // Salva o rascunho no state e ref do documento em this.docRef e dá setState():

                    let s = this.state;
                    s.draft = QuerySnapshot.data();
                    this._docRef = QuerySnapshot.ref.id;

                    //Seta o tempDraft com seja lá o que tiver recebido do Firestore + um 'firestoreReferenceId' que é o id do evento:
                    this.props.setTempDraft(QuerySnapshot.data());

                    this.setState(s);
                }
            });
        } else {
            //Se já existir tempDraft (o que significa que o usuário está vindo do botão de 'Criar Evento', através do DraftSwitch) ele só conecta com o firestore
            //e define this.draft já que não precisa setar o tempDraft:

            let unsubscribe = firebase.firestore().doc('events/'+this.props.tempDraft.firestoreReferenceId).onSnapshot({
                error: e=>console.error('erro ao pegar rascunho do firestore:', e),
                next: QuerySnapshot=>{
                    // Salva o rascunho no state e ref do documento em this.docRef e dá setState():

                    let s = this.state;
                    s.draft = QuerySnapshot.data();
                    this._docRef = QuerySnapshot.ref.id;
                    this.setState(s);
                }
            });
        }
    }
    
    componentWillUnmount(){
        //Toda vez que a tela for desmontada, ele limpa o tempDraft:

        !this._isMounted && this.props.setTempDraft(null);
    }

    async _cleanTempDraft(){
        !this._isMounted && this.props.setTempDraft(null);
    }

    _saveAsDraft(){
        //Verifica se firestorereferenceId está definido e se estiver tira ele, depois, invariavelmente do if guarda tempDraft no banco;

        if(this.props.tempDraft != undefined){
            delete this.props.tempDraft.firestoreReferenceId;
        }
        firebase.firestore().doc('events/'+this._docRef).set({...this.props.tempDraft, published: false}, { merge: true });
        this.props.navigation.navigate('Drafts');
    }

    render(){
        return (
            <View style={draftProgressStyles.container}>
                <View style={draftProgressStyles.textContainer}>
                    <Text style={[draftProgressStyles.text, { color: this.props.ColUITheme.main }]}>Preencha os dados para criar o evento</Text>
                </View>
                <ColUI.Steps navigation={this.props.navigation} stepsData={this.state.stepData} />
                <View style={draftProgressStyles.buttonsContainer}>
                    <ColUI.Button secondary label='rascunho' onPress={()=>this._saveAsDraft()} />
                    <ColUI.Button label='publicar' />
                </View>
            </View>
        );
    }
}

const draftProgressStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center'
    },
    textContainer:{
        height: 50,
        width,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    text:{
        fontSize: 18
    },
    buttonsContainer:{
        height: height*0.1,
        width,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    }
});

//===============================================================================================

class EventNameInput extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            disabled: true,
            name: ''
        }
        this._handleNameInput = this._handleNameInput.bind(this);
        this._confirm = this._confirm.bind(this);
    }

    _handleNameInput(name){
        let s = this.state;
        if(name != ''){
            s.disabled = false;
        } else {
            s.disabled = true;
        }
        s.name = name;
        this.setState(s);
    }

    async _confirm(){
        //Cria um draft no Firestore, pega o id gerado dele e o nome e coloca em tempDraft, depois redireciona para 'OpenDraft', que é o fluxo normal de rascunhos:
        let eventRef = firebase.firestore().collection('events').doc(); //Cria novo documento no firestore
        eventRef.set({name: this.state.name, published: false}); //seta o nome dentro do documento

        //Seta o tempDraft == AVISO == setTempDraft() aparentemente é assíncrono
        await this.props.setTempDraft({name: this.state.name, firestoreReferenceId: eventRef.id, createdAt: firebase.firestore.FieldValue.serverTimestamp()});
        this.props.navigation.navigate('OpenDraft'); // == AVISO == retirar toda a lógica de {mode}
    }

    render(){
        return (
            <View style={EventNameInputStyles.container}>
                <View style={EventNameInputStyles.textsContainer}>
                    <Text style={EventNameInputStyles.title}>Escreva abaixo o nome do evento</Text>
                    <Text style={EventNameInputStyles.disclaimer}>Não se preocupe, você pode mudar isso depois</Text>
                </View>
                <View style={EventNameInputStyles.inputAndButtonContainer}>
                    <ColUI.TextInput label='Nome do evento' onChangeText={(name)=>this._handleNameInput(name)} />
                    <ColUI.Button disabled={this.state.disabled} label='confirmar' onPress={()=>this._confirm()} />
                </View>
            </View>
        );
    }
}

const EventNameInputStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    textsContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    title:{
        fontSize: 20
    },
    disclaimer:{
        fontSize: 16,
        color: '#888'
    },
    inputAndButtonContainer:{
        flex: 2,
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})

//=========================================================================================

class EventType extends React.Component {
    render(){
        return (
            <View style={EventTypeStyles.container}>
                <Text style={EventTypeStyles.test}>Tipo de Evento</Text>
            </View>
        );
    }
}

const EventTypeStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    test:{
        fontSize: 20
    }
});

//==========================================================================================

class EventDescription extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            disabled: true,
            description: ''
        }
        this._handleInput = this._handleInput.bind(this);
        this._confirm = this._confirm.bind(this);
    }

    _handleInput(d){
        let s = this.state;
        if(d != ''){
            s.disabled = false;
        } else {
            s.disabled = true;
        }
        s.description = d;
        this.setState(s);
    }

    _confirm(){
        this.props.setTempDraft({ ...this.props.tempDraft, description: this.state.description });
        this.props.navigation.goBack(null);
    }

    render(){
        return (
            <View style={EventDescriptionStyles.container}>
                <View style={EventDescriptionStyles.textContainer}>
                    <Text style={[EventDescriptionStyles.text, { color: this.props.ColUITheme.main }]}>Adicione uma descrição para o seu evento</Text>
                </View>
                <View style={EventDescriptionStyles.textAreaContainer}>
                    <Textarea
                    rowSpan={10}
                    bordered 
                    placeholder='Descrição'
                    style={[EventDescriptionStyles.textArea, { borderColor: this.props.ColUITheme.main }]}
                    onChangeText={(d)=>this._handleInput(d)}
                    />
                </View>
                <View style={EventDescriptionStyles.buttonsContainer}>
                    <ColUI.Button secondary label='cancelar' onPress={()=>this.props.navigation.goBack(null)} />
                    <ColUI.Button disabled={this.state.disabled} label='confirmar' onPress={()=>this._confirm()} />
                </View>
            </View>
        );
    }
}

const EventDescriptionStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textContainer:{
        height: 50,
        width,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    text:{
        fontSize: 18
    },
    textAreaContainer:{
        flex: 4,
        alignItems: 'center',
        paddingTop: 30
    },
    textArea:{
        width: GridWidth(6),
        borderRadius: 5
    },
    buttonsContainer:{
        flex: 1,
        width,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    }
});

//==========================================================================================

class EventDate extends React.Component {
    render(){
        return (
            <View style={EventDateStyles.container}>
                <Text style={EventDateStyles.test}>Data, local e horário do Evento</Text>
            </View>
        );
    }
}

const EventDateStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    test:{
        fontSize: 20
    }
});

//==========================================================================================

class EventSchedule extends React.Component {
    render(){
        return (
            <View style={EventScheduleStyles.container}>
                <Text style={EventScheduleStyles.test}>Programação do Evento</Text>
            </View>
        );
    }
}

const EventScheduleStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    test:{
        fontSize: 20
    }
});

//==========================================================================================

class EventTickets extends React.Component {
    render(){
        return (
            <View style={EventTicketsStyles.container}>
                <Text style={EventTicketsStyles.test}>Ingressos do Evento</Text>
            </View>
        );
    }
}

const EventTicketsStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    test:{
        fontSize: 20
    }
});

//==========================================================================================

class EventProducts extends React.Component {
    render(){
        return (
            <View style={EventProductsStyles.container}>
                <Text style={EventProductsStyles.test}>Produtos do Evento</Text>
            </View>
        );
    }
}

const EventProductsStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    test:{
        fontSize: 20
    }
});

//==========================================================================================

class EventServices extends React.Component {
    render(){
        return (
            <View style={EventServicesStyles.container}>
                <Text style={EventServicesStyles.test}>Serviços do Evento</Text>
            </View>
        );
    }
}

const EventServicesStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    test:{
        fontSize: 20
    }
});

//==========================================================================================

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme,
    tempDraft: state.draftsReducer.temp
});

const mapDispatchToProps = (dispatch)=>({
    setTempDraft: (temp)=> dispatch({ type: 'UPDATE_TEMP_DRAFT', payload: temp })
});

const ProcessDraftScreen = connect(mapStateToProps)(ProcessDraft);
const EventNameInputScreen = connect(mapStateToProps, mapDispatchToProps)(EventNameInput);
const DraftProgressScreen = connect(mapStateToProps, mapDispatchToProps)(DraftProgress);
const EventTypeScreen = connect(mapStateToProps)(EventType);
const EventDescriptionScreen = connect(mapStateToProps, mapDispatchToProps)(EventDescription);
const EventDateScreen = connect(mapStateToProps)(EventDate);
const EventScheduleScreen = connect(mapStateToProps)(EventSchedule);
const EventTicketsScreen = connect(mapStateToProps)(EventTickets);
const EventProductsScreen = connect(mapStateToProps)(EventProducts);
const EventServicesScreen = connect(mapStateToProps)(EventServices);

export default {
    ProcessDraftScreen,
    EventNameInputScreen,
    DraftProgressScreen,
    EventTypeScreen,
    EventDescriptionScreen,
    EventDateScreen,
    EventScheduleScreen,
    EventTicketsScreen,
    EventProductsScreen,
    EventServicesScreen
};