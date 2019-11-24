import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { CreateEventScreens, InConstructionScreen } from '../screens';
import ColaeAPI from "../api";

const { ColUI } = ColaeAPI;

const CreateEventStack = createStackNavigator({
    CreateEvent:{
        screen: CreateEventScreens.ProgressScreen,
        navigationOptions:{
            title: 'Criar Evento',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='criar evento' />;
            }
        }
    },
    EventNameInput: {
        screen: CreateEventScreens.EventNameInputScreen,
        navigationOptions:{
            title: 'Definir Nome',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Definir Nome' />;
            }
        }
    },
    placeholder:{
        screen: InConstructionScreen,
        navigationOptions:{
            title: 'Em construção',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='em construção' />;
            }
        }
    }
},{
    initialRouteName:'CreateEvent'
});

export default CreateEventStack;