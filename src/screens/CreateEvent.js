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
    {routename:'EventNameInput', description: 'Tipo de Evento'},
    {routename: 'placeholder', description: 'Descrição do Evento'},
    {routename: 'placeholder', description: 'Data, local e horário'},
    {routename: 'placeholder', description: 'Programação (opcional)'},
    {routename: 'placeholder', description: 'Ingressos'},
    {routename: 'placeholder', description: 'Produtos'},
    {routename: 'placeholder', description: 'Serviços'}
];

class Progress extends React.Component {
    render(){
        return (
            <View style={progressStyles.container}>
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
    buttonsContainer:{
        height: height*0.1,
        width,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    }
});


class EventNameInput extends React.Component {
    render(){
        return (
            <View style={EventNameInputStyles.container}>
                <Text style={EventNameInputStyles.test}>Definir nome do evento</Text>
            </View>
        );
    }
}

const EventNameInputStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    test:{
        fontSize: 20
    }
})


const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
});


const ProgressScreen = connect(mapStateToProps)(Progress);
const EventNameInputScreen = connect(mapStateToProps)(EventNameInput);

export default { ProgressScreen, EventNameInputScreen };