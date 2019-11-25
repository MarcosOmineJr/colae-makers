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

const { ColUI } = ColaeAPI;

const { width, height } = Dimensions.get('screen');

const stepData = [
    {routename: 'EventType', fields: ['template'], description: 'Tipo de Evento', done: false},
    {routename: 'EventDescription', fields: ['description'], description: 'Descrição do Evento', done: false},
    {routename: 'EventDate', fields: ['dates', 'locale', 'duration'], description: 'Data, local e horário', done: false},
    {routename: 'EventSchedule', fields:['schedule'], description: 'Programação (opcional)', done: false},
    {routename: 'EventTickets', fields:['tickets'], description: 'Ingressos', done: false},
    {routename: 'EventProducts', fields: ['products'], description: 'Produtos', done: false},
    {routename: 'EventServices', fields:['services'], description: 'Serviços', done: false}
];
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
            stepData,
            test: 'la'
        }
        this._checkProgress = this._checkProgress.bind(this);
        this._saveAsDraft = this._saveAsDraft.bind(this);

        const subscribeToDidFocus = this.props.navigation.addListener('didFocus', ()=>{console.log('Rodou didFocus'); this._checkProgress();});
    }
    componentDidMount(){
        console.log('rodou ComponentDidMount');
    }

    _saveAsDraft(){
        this.props.setTempAsDraft(null);
        this.props.navigation.goBack(null);
    }

    _checkProgress(){
        let s = this.state;
        console.log('checkProgress foi chamado');
        switch(this.props.navigation.getParam('mode', 'remote')){
            case 'temp':
                s.stepData.forEach((step)=>{
                    let allFieldsAreCompleted = true;
                    let i = 0;
                    while(allFieldsAreCompleted && i < step.fields.length){
                        if(this.props.tempDraft[step.fields[i]] == undefined){
                            allFieldsAreCompleted = false;
                        }
                        i++;
                    }
                    if(allFieldsAreCompleted){
                        step.done = true;
                    }
                });
                break;
            default:
                s.stepData.forEach((step)=>{
                    let allFieldsAreCompleted = true;
                    let i = 0;
                    while(allFieldsAreCompleted){
                        if(this.props.event[step.fields[i]] == undefined && i < step.fields.length){
                            allFieldsAreCompleted = false;
                        }
                        i++;
                    }
                    if(allFieldsAreCompleted){
                        step.done = true;
                    }
                });
        }
        console.log('chamando setState em checkProgress');
        this.setState(s);
    }

    render(){
        console.log('render de DraftProgress foi chamado');
        console.log('com o state:', this.state);
        
        return (
            <View style={draftProgressStyles.container}>
                <View style={draftProgressStyles.textContainer}>
                    <Text style={[draftProgressStyles.text, { color: this.props.ColUITheme.main }]}>Preencha os dados para criar o evento</Text>
                </View>
                <ColUI.Steps navigation={this.props.navigation} stepsData={this.state.stepData} />
                <View style={draftProgressStyles.buttonsContainer}>
                    <ColUI.Button secondary label='rascunho' onPres={()=>this._saveAsDraft()} />
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

    _confirm(){
        this.props.setTempDraft({name: this.state.name});
        this.props.navigation.navigate('DraftProgress', { mode: 'temp' });
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