import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';
import {
    Textarea,
    Button,
    Icon
} from 'native-base';
import { NavigationEvents } from 'react-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
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
                {routename: 'EventType', fields: ['template'], description: 'Informações Básicas', done: true},
                {routename: 'EventDescription', fields: ['description'], description: 'Descrição do Evento', done: true},
                {routename: 'EventDate', fields: ['dates', 'locale', 'duration'], description: 'Local, data e horário', done: false},
                {routename: 'EventServices', fields:['schedule'], description: 'Organizadores e Serviços', done: false},
                {routename: 'EventTickets', fields:['tickets'], description: 'Ingressos', done: false}
            ],
            draft: {}
        }
        this._saveAsDraft = this._saveAsDraft.bind(this);
        this._checkSteps = this._checkSteps.bind(this);
    }

    //Propriedade inicialmente vazia:
    _docRef = '';

    componentDidMount(){

        const { firebaseRef } = this.props.user;
        const { tempDraft } = this.props;

        if(this.props.navigation.getParam('draftId', 'NO-ID') == 'NO-ID'){

            //Se ele vier para essa tela sem um param draftID, ele conecta com o firestore pelo tempDraft;

            this.unsubscribe = firebase.firestore().collection('users').doc(firebaseRef).collection('events').doc(tempDraft.firestoreReferenceId).onSnapshot({
                error: e=>console.error('erro ao pegar rascunho do firestore:', e),
                next: QuerySnapshot=>{
                    // Salva o rascunho no state e ref do documento em this._docRef e dá setState():

                    let s = this.state;
                    s.draft = QuerySnapshot.data();
                    this._docRef = QuerySnapshot.ref.id;
                    this.setState(s);
                }
            });

        } else {
            
            //Se vier para a tela com param draftId, ele usa essa informação para pegar os dados do firestore;

            this.unsubscribe = firebase.firestore().doc('events/'+this.props.navigation.getParam('draftId', 'NO-ID')).onSnapshot({
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

        }
    }

    componentWillUnmount(){
        //Limpa o listener quando o componente fica vazio:

        this.unsubscribe();
    }

    _checkSteps(){
        //Deve checar a completude dos passos e atualizar o state
        console.log('rodou _checkSteps');
    }

    _saveAsDraft(){

        //pega o ref do usuário:
        const { firebaseRef } = this.props.user;

        //Verifica se firestorereferenceId está definido e se estiver tira ele, depois, invariavelmente do if guarda tempDraft no banco;

        if(this.props.tempDraft != undefined){
            delete this.props.tempDraft.firestoreReferenceId;
        }
        firebase.firestore().collection('users').doc(firebaseRef).collection('events').doc(this._docRef).set({...this.props.tempDraft}, { merge: true });
        this.props.navigation.navigate('Drafts');
    }

    render(){
        return (
            <View style={draftProgressStyles.container}>
                <NavigationEvents onDidFocus={this._checkSteps} />
                <View style={draftProgressStyles.textContainer}>
                    <Text style={[draftProgressStyles.text, { color: this.props.ColUITheme.main }]}>Preencha os dados para criar o evento</Text>
                </View>
                <ColUI.Steps navigation={this.props.navigation} stepsData={this.state.stepData} />
                <View style={draftProgressStyles.buttonsContainer}>
                    <ColUI.Button blue label='salvar rascunho' onPress={()=>this._saveAsDraft()} />
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

        //Pegando a referência do usuário para o registro no Firebase:
        const { firebaseRef } = this.props.user;

        //Cria um draft no Firestore, pega o id gerado dele e o nome e coloca em tempDraft, depois redireciona para 'OpenDraft', que é o fluxo normal de rascunhos:
        let eventRef = firebase.firestore().collection('users').doc(firebaseRef).collection('events').doc(); //Cria novo documento no firestore
        eventRef.set({name: this.state.name, owner: firebaseRef}); //seta o nome dentro do documento

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

        const { ColUITheme } = this.props;

        return (
            <View style={EventTypeStyles.container}>
                <View style={EventTypeStyles.contentContainer}>
                    <Text style={[EventTypeStyles.sectionTitle, { color: ColUITheme.gray.light }, { marginTop:0 }]}>Adicionar Fotos</Text>
                    <ColUI.PhotoInput />

                    <Text style={[EventTypeStyles.sectionTitle, { color: ColUITheme.gray.light }]}>Categoria de Evento</Text>

                    <View style={EventTypeStyles.categoryContainer}>
                        <View style={EventTypeStyles.tagRow}>
                            <ColUI.Tag contentContainerStyle={EventTypeStyles.tag} label='Show' onPress={()=>{}} />
                            <ColUI.Tag contentContainerStyle={EventTypeStyles.tag} label='Palestra' onPress={()=>{}} />
                            <ColUI.Tag contentContainerStyle={EventTypeStyles.tag} label='Balada' onPress={()=>{}} />
                            <ColUI.Tag contentContainerStyle={EventTypeStyles.tag} label='Negócios' onPress={()=>{}} />
                        </View>
                        <View style={EventTypeStyles.tagRow}>
                            <ColUI.Tag contentContainerStyle={EventTypeStyles.tag} label='Gastronomia' onPress={()=>{}} />
                            <ColUI.Tag contentContainerStyle={EventTypeStyles.tag} label='Espetáculo' onPress={()=>{}} />
                            <ColUI.Tag contentContainerStyle={EventTypeStyles.tag} label='Esportivo' onPress={()=>{}} />
                        </View>
                        <View style={EventTypeStyles.tagRow}>
                            <ColUI.Tag contentContainerStyle={EventTypeStyles.tag} label='Religioso' onPress={()=>{}} />
                            <ColUI.Tag contentContainerStyle={EventTypeStyles.tag} label='Curso/Workshop' onPress={()=>{}} />
                            <ColUI.Tag contentContainerStyle={EventTypeStyles.tag} label='Arte e Cultura' onPress={()=>{}} />
                        </View>
                        <View style={EventTypeStyles.tagRow}>
                            <ColUI.Tag contentContainerStyle={EventTypeStyles.tag} label='Tecnologia' onPress={()=>{}} />
                            <ColUI.Tag contentContainerStyle={EventTypeStyles.tag} label='Outros' onPress={()=>{}} />
                        </View>
                    </View>

                    <Text style={[EventTypeStyles.sectionTitle, { color: ColUITheme.gray.light }]}>Palavras - chave</Text>
                    <Textarea
                    rowSpan={5}
                    bordered
                    style={EventTypeStyles.textArea}
                    onChangeText={()=>{}}
                    />
                </View>
                
                <View style={EventTypeStyles.buttonsContainer}>
                    <ColUI.Button blue label='salvar rascunho' onPress={()=>{}} />
                    <ColUI.Button label='próximo' />
                </View>
            </View>
        );
    }
}

const EventTypeStyles = StyleSheet.create({
    container:{
        flex: 1,
        height,
        padding: 20,
        alignItems: 'center'
    },
    contentContainer:{
        width: '100%',
        alignItems: 'flex-start'
    },
    sectionTitle:{
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20
    },
    categoryContainer:{

    },
    buttonsContainer:{
        position: 'absolute',
        bottom: 0,
        height: height*0.1,
        width,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    tag:{
        marginRight: 10
    },
    tagRow: {
        flexDirection: 'row',
        marginTop: 10
    },
    textArea:{
        width: GridWidth(6),
        borderRadius: 10,
        borderColor: '#999999'
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
                    <Text style={[EventDescriptionStyles.text, { color: this.props.ColUITheme.gray.light }]}>Adicione uma descrição para o seu evento</Text>
                </View>
                <View style={EventDescriptionStyles.textAreaContainer}>
                    <Textarea
                    rowSpan={10}
                    bordered 
                    placeholder='Descrição'
                    style={[EventDescriptionStyles.textArea, { borderColor: this.props.ColUITheme.gray.light }]}
                    onChangeText={(d)=>this._handleInput(d)}
                    />
                </View>
                <View style={EventDescriptionStyles.buttonsContainer}>
                    <ColUI.Button blue label='salvar rascunho' onPress={()=>{}} />
                    <ColUI.Button label='próximo' />
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
        fontSize: 18,
        fontWeight: 'bold'
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

    constructor(props){
        super(props);

        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        this.state = {
            dates: {
                from: new Date(),
                to: tomorrow
            },
            time:{
                from: new Date(2000, 1, 2, 0, 0),
                to: new Date(2000, 1, 2, 0, 0),
            },
            show: {
                dates: {
                    from: false,
                    to: false
                },
                time: {
                    from: false,
                    to: false
                }
            },
            mode: 'datetime'
        }

        this._openPicker = this._openPicker.bind(this);
        this._setDate = this._setDate.bind(this);
    }

    _openPicker(mode, field){
        let s = this.state;
        s.show[mode][field] = true;
        if(mode == 'dates'){
            s.mode = 'date';
        } else {
            s.mode = 'time';
        }
        this.setState(s);
    }

    _setDate(event, input, mode, field){
        let s = this.state;
        if(input){
            switch(mode){
                case 'dates':
                    if(field == 'to'){
                        if(input.getTime() < s.dates.from.getTime()){
                            alert('Você não pode colocar uma data de final de evento anterior à data de início');
                        } else {
                            s[mode][field] = input;
                        }
                    } else {
                        s[mode][field] = input;
                    }
                    break;
                case 'time':
                    if(field == 'to'){
                        if(input.getTime() < s.time.from.getTime()){
                            alert('Você não pode colocar um horário de encerramento anterior ao horário de início');
                        } else {
                            s[mode][field] = input;
                        }
                    } else {
                        s[mode][field] = input;
                    }
                    break;
            }
        }
        s.show[mode][field] = false;
        this.setState(s);
    }

    render(){

        const { ColUITheme } = this.props;
        const { dates, time, show, mode } = this.state;

        return (
            <View style={EventDateStyles.container}>
                <Text style={[EventDateStyles.text, { color: ColUITheme.gray.light }]}>Adicione o Local, a data e horário</Text>
                <ColUI.TextInput style={EventDateStyles.localInput} label='Local do Evento' />
                <View style={EventDateStyles.dateAndHourContainer}>
                    <View style={EventDateStyles.dateContainer}>
                        <Text style={[EventDateStyles.text, { color: ColUITheme.gray.light }]}>Data</Text>
                        <View style={EventDateStyles.inputsContainer}>
                            <ColUI.DatePicker date={dates.from} onPress={()=>this._openPicker('dates','from')} />
                            {show.dates.from && <DateTimePicker mode={mode} value={dates.from} onChange={(event, date)=>this._setDate(event, date,'dates','from')} />}
                            <Text style={EventDateStyles.text}>à</Text>
                            <ColUI.DatePicker date={dates.to} onPress={()=>this._openPicker('dates','to')} />
                            {show.dates.to && <DateTimePicker mode={mode} value={dates.from} onChange={(event, date)=>this._setDate(event, date,'dates','to')} />}
                        </View>
                    </View>
                    <View style={EventDateStyles.hourContainer}>
                        <Text style={[EventDateStyles.text, { color: ColUITheme.gray.light }]}>Horário</Text>
                        <View style={EventDateStyles.inputsContainer}>
                            <ColUI.TimePicker time={time.from} onPress={()=>this._openPicker('time','from')} />
                            {show.time.from && <DateTimePicker mode={mode} value={time.from} onChange={(event, date)=>this._setDate(event, date,'time','from')} />}
                            <Text style={EventDateStyles.text}>às</Text>
                            <ColUI.TimePicker time={time.to} onPress={()=>this._openPicker('time','to')} />
                            {show.time.to && <DateTimePicker mode={mode} value={time.to} onChange={(event, date)=>this._setDate(event, date,'time','to')} />}
                        </View>
                    </View>
                </View>
                <View style={EventDateStyles.buttonsContainer}>
                    <ColUI.Button blue label='salvar rascunho' onPress={()=>{}} />
                    <ColUI.Button label='próximo' />
                </View>
            </View>
        );
    }
}

const EventDateStyles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        padding: 20
    },
    text:{
        fontSize: 18,
        fontWeight: 'bold'
    },
    localInput:{
        marginTop: 20
    },
    dateAndHourContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width,
        paddingHorizontal: 20,
        marginTop: 40
    },
    dateContainer:{
        flex: 1.35,
        alignItems: 'center'
    },
    hourContainer:{
        flex: 1,
        alignItems: 'center'
    },
    inputsContainer:{
        flexDirection: 'row',
        paddingHorizontal: 20,
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 20
    },
    buttonsContainer:{
        position: 'absolute',
        bottom: 0,
        height: height*0.1,
        width,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
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

    _TEMP_mockData = {
        day: new Date()
    }

    render(){

        const { ColUITheme } = this.props;

        return (
            <View style={EventTicketsStyles.container}>
                <Text style={[EventTicketsStyles.title, { color: ColUITheme.gray.light }]}>Ingressos</Text>
                <View style={[EventTicketsStyles.dayContainer, { backgroundColor: ColUITheme.main }]}>
                    <Text style={EventTicketsStyles.dayText}>{
                    (this._TEMP_mockData.day.getDate().toString().length > 1 ? this._TEMP_mockData.day.getDate() :  '0'+this._TEMP_mockData.day.getDate().toString())
                    +'/'+
                    ((this._TEMP_mockData.day.getMonth()+1).toString().length > 1 ? (this._TEMP_mockData.day.getMonth()+1) : '0'+(this._TEMP_mockData.day.getMonth+1).toString())
                    +'/'+
                    this._TEMP_mockData.day.getFullYear()
                    }</Text>
                </View>
                <View style={EventTicketsStyles.ticketsContainer}>
                    <TouchableOpacity onPress={()=>Alert.alert('Esperaê!','Na versão Closed Alpha ainda só é possível fazer eventos gratuitos')}>
                        <ColUI.SecondaryCard addButton={false} contentContainerStyle={EventTicketsStyles.ticketCard} >
                        <View style={EventTicketsStyles.ticketType}>
                            <View style={EventTicketsStyles.fullValue}>
                                <Text style={EventTicketsStyles.ticketTypeLabel} >Inteira</Text>
                                <Text style={EventTicketsStyles.ticketTypeValue} >Valor: R$ 00,00</Text>
                            </View>
                            <View style={EventTicketsStyles.halfValue}>
                                <Text style={EventTicketsStyles.ticketTypeLabel} >Meia</Text>
                                <Text style={EventTicketsStyles.ticketTypeValue} >Valor: R$ 00,00</Text>
                            </View>
                        </View>
                        </ColUI.SecondaryCard>
                    </TouchableOpacity>
                    <ColUI.SecondaryCard onPress={()=>Alert.alert('Esperaê!','Na versão Closed Alpha ainda só é possível fazer eventos gratuitos')} />
                </View>
                <View style={EventDateStyles.buttonsContainer}>
                    <ColUI.Button blue label='salvar rascunho' onPress={()=>{}} />
                    <ColUI.Button label='próximo' />
                </View>
            </View>
        );
    }
}

const EventTicketsStyles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20,
        alignItems: 'flex-start'
    },
    title:{
        fontSize: 18,
        fontWeight: 'bold'
    },
    dayContainer:{
        marginVertical: 20,
        padding: 5,
        paddingHorizontal: 10
    },
    dayText:{
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    ticketsContainer:{
        flexDirection: 'row'
    },
    ticketCard:{
        marginRight: 20
    },
    ticketType:{
        marginRight: 30
    },
    ticketTypeLabel:{
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 5
    },
    ticketTypeValue:{
        fontSize: 14,
        color: 'white'
    },
    fullValue:{
        marginBottom: 10
    },
    buttonsContainer:{
        position: 'absolute',
        bottom: 0,
        height: height*0.1,
        width,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
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

        const { ColUITheme, navigation } = this.props;

        return (
            <View style={EventServicesStyles.container}>
                <View style={EventServicesStyles.organizadoresWrapper}>
                    <ScrollView contentContainerStyle={EventServicesStyles.organzizadoresScrollView}>
                        <Text style={[EventServicesStyles.title, { color: ColUITheme.gray.light }]}>Organizadores</Text>
                        <Button iconLeft transparent onPress={()=>navigation.navigate('AddContacts')}>
                            <Icon type='MaterialIcons' name='add' style={[EventServicesStyles.icon, { color: ColUITheme.main }]} />
                            <Text style={{ color: ColUITheme.main }}>ADICIONAR ORGANIZADOR</Text>
                        </Button>
                    </ScrollView>
                </View>
                <View style={EventServicesStyles.prestadoresWrapper}>
                    <ScrollView contentContainerStyle={EventServicesStyles.prestadoresScrollView}>
                        <Text style={[EventServicesStyles.title, { color: ColUITheme.gray.light }]}>Prestadores de Serviços</Text>
                        <Button iconLeft transparent onPress={()=>navigation.navigate('AddContacts')}>
                            <Icon type='MaterialIcons' name='add' style={[EventServicesStyles.icon, { color: ColUITheme.main }]} />
                            <Text style={{ color: ColUITheme.main }}>ADICIONAR PRESTADOR DE SERVIÇO</Text>
                        </Button>
                    </ScrollView>
                </View>
                <View style={EventServicesStyles.buttonsContainer}>
                    <ColUI.Button blue label='salvar rascunho' onPress={()=>{}} />
                    <ColUI.Button label='próximo' />
                </View>
            </View>
        );
    }
}

const EventServicesStyles = StyleSheet.create({
    container:{
        flex: 1
    },
    organizadoresWrapper: {
        flex: 1
    },
    prestadoresWrapper: {
        flex: 1
    },
    organzizadoresScrollView:{
        padding: 20,
        alignItems: 'flex-start'
    },
    prestadoresScrollView:{
        padding: 20,
        alignItems: 'flex-start'
    },
    icon:{
        fontSize: 18,
        marginRight: 5
    },
    addBtn:{
        fontSize: 16
    },
    title:{
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonsContainer:{
        position: 'absolute',
        bottom: 0,
        height: height*0.1,
        width,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    }
});

//==========================================================================================

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme,
    tempDraft: state.draftsReducer.temp,
    user: state.userReducer
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