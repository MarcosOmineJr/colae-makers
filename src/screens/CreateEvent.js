import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const { width, height } = Dimensions.get('screen');

let stepData = [
    {routename: 'EventType', description: 'Tipo de Evento'},
    {routename: 'EventDescription', description: 'Descrição do Evento'},
    {routename: 'EventDate', description: 'Data, local e horário'},
    {routename: 'EventSchedule', description: 'Programação (opcional)'},
    {routename: 'EventTickets', description: 'Ingressos'},
    {routename: 'EventProducts', description: 'Produtos'},
    {routename: 'EventServices', description: 'Serviços'}
];

class Progress extends React.Component {
    render(){
        return (
            <View style={progressStyles.container}>
                <View style={progressStyles.textContainer}>
                    <Text style={[progressStyles.text, { color: this.props.ColUITheme.main }]}>Preencha os dados para criar o evento</Text>
                </View>
                <ColUI.Steps navigation={this.props.navigation} stepsData={stepData} />
                <View style={progressStyles.buttonsContainer}>
                    <ColUI.Button secondary label='rascunho' />
                    <ColUI.Button label='publicar' />
                </View>
            </View>
        );
    }
}

const progressStyles = StyleSheet.create({
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
            disabled: true
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
        this.setState(s);
    }

    _confirm(){
        this.props.navigation.navigate('Progress');
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
    render(){
        return (
            <View style={EventDescriptionStyles.container}>
                <Text style={EventDescriptionStyles.test}>Descrição do Evento</Text>
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
    test:{
        fontSize: 20
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
    ColUITheme: state.themesReducer.ColUITheme
});


const EventNameInputScreen = connect(mapStateToProps)(EventNameInput);
const ProgressScreen = connect(mapStateToProps)(Progress);
const EventTypeScreen = connect(mapStateToProps)(EventType);
const EventDescriptionScreen = connect(mapStateToProps)(EventDescription);
const EventDateScreen = connect(mapStateToProps)(EventDate);
const EventScheduleScreen = connect(mapStateToProps)(EventSchedule);
const EventTicketsScreen = connect(mapStateToProps)(EventTickets);
const EventProductsScreen = connect(mapStateToProps)(EventProducts);
const EventServicesScreen = connect(mapStateToProps)(EventServices);

export default {
    EventNameInputScreen,
    ProgressScreen,
    EventTypeScreen,
    EventDescriptionScreen,
    EventDateScreen,
    EventScheduleScreen,
    EventTicketsScreen,
    EventProductsScreen,
    EventServicesScreen
};