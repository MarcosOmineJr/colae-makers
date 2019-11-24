import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { CreateEventScreens, InConstructionScreen } from '../screens';
import ColaeAPI from "../api";

const { ColUI } = ColaeAPI;

const CreateEventStack = createStackNavigator({
    CreateEventName: {
        screen: CreateEventScreens.EventNameInputScreen,
        navigationOptions:{
            title: 'Definir Nome',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Definir Nome' />;
            }
        }
    },
    Progress:{
        screen: CreateEventScreens.ProgressScreen,
        navigationOptions:{
            title: 'Criar Evento',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Criar Evento' />;
            }
        }
    },
    EventType:{
        screen: CreateEventScreens.EventTypeScreen,
        navigationOptions:{
            title: 'Tipo de Evento',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Tipo de Evento' />;
            }
        }
    },
    EventDescription:{
        screen: CreateEventScreens.EventDescriptionScreen,
        navigationOptions:{
            title: 'Descrição',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Descrição' />;
            }
        }
    },
    EventDate:{
        screen: CreateEventScreens.EventDateScreen,
        navigationOptions:{
            title: 'Data, local e horário',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Data, Local e Horário' />;
            }
        }
    },
    EventSchedule:{
        screen: CreateEventScreens.EventScheduleScreen,
        navigationOptions:{
            title: 'Programação',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Programação' />;
            }
        }
    },
    EventTickets:{
        screen: CreateEventScreens.EventTicketsScreen,
        navigationOptions:{
            title: 'Ingressos',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Ingressos' />;
            }
        }
    },
    EventProducts:{
        screen: CreateEventScreens.EventProductsScreen,
        navigationOptions:{
            title: 'Produtos',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Produtos' />;
            }
        }
    },
    EventServices:{
        screen: CreateEventScreens.EventTypeScreen,
        navigationOptions:{
            title: 'Serviços',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Serviços' />;
            }
        }
    }
},{
    initialRouteName:'CreateEventName'
});

export default CreateEventStack;