import React from 'react';
import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { DraftManager, InConstructionScreen, ContactsForAdding } from '../screens';
import ColaeAPI from "../api";

const { ColUI } = ColaeAPI;

const DraftStack = createStackNavigator({
    DraftProgress:{
        screen: DraftManager.DraftProgressScreen,
        navigationOptions:{
            title: 'Criar Evento',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Criar Evento' />;
            }
        }
    },
    EventType:{
        screen: DraftManager.EventTypeScreen,
        navigationOptions:{
            title: 'Informações Básicas',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Informações Básicas' />;
            }
        }
    },
    EventDescription:{
        screen: DraftManager.EventDescriptionScreen,
        navigationOptions:{
            title: 'Descrição',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Descrição' />;
            }
        }
    },
    EventDate:{
        screen: DraftManager.EventDateScreen,
        navigationOptions:{
            title: 'Data, local e horário',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Data, Local e Horário' />;
            }
        }
    },
    EventSchedule:{
        screen: DraftManager.EventScheduleScreen,
        navigationOptions:{
            title: 'Programação',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Programação' />;
            }
        }
    },
    EventTickets:{
        screen: DraftManager.EventTicketsScreen,
        navigationOptions:{
            title: 'Ingressos',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Ingressos' />;
            }
        }
    },
    EventProducts:{
        screen: DraftManager.EventProductsScreen,
        navigationOptions:{
            title: 'Produtos',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Produtos' />;
            }
        }
    },
    EventServices:{
        screen: DraftManager.EventServicesScreen,
        navigationOptions:{
            title: 'Serviços',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Serviços' />;
            }
        }
    },
    AddContacts:{
        screen: ContactsForAdding,
        navigationOptions:{
            title: 'Serviços',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Meus Contatos' />;
            }
        }
    }
},{
    initialRouteName:'DraftProgress'
});

const DraftName = createStackNavigator({
    EventNameInputScreen:{
        screen: DraftManager.EventNameInputScreen,
        navigationOptions:{
            title: 'Definir Nome',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Definir Nome' />;
            }
        }
    }
},{
    initialRouteName: 'EventNameInputScreen'
});

const DraftSwitch = createSwitchNavigator({
    DraftName:{
        screen: DraftName //Fluxo para caso seja um rascunho novo
    },
    OpenDraft:{
        screen: DraftStack //Fluxo de todo rascunho no Firebase
    }
},{
    initialRouteName: 'DraftName'
});

export default DraftSwitch;