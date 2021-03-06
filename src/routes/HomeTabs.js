import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { connect } from 'react-redux';
import DraftSwitch from './DraftStack';
import { InactivesScreen, ActiveScreen, DraftsScreen, EventScreen, ProfileScreen } from '../screens';
import ColaeAPI from '../api';
import MetricsTabs from './MetricsTabs';

const { ColUI } = ColaeAPI;

const HomeTabs = createMaterialTopTabNavigator({
    Active:{
        screen: ActiveScreen,
        navigationOptions: {
            tabBarLabel: 'Ativos'
        }
    },
    Drafts:{
        screen:DraftsScreen,
        navigationOptions:{
            tabBarLabel: 'Rascunhos'
        }
    },
    Inactive:{
        screen:InactivesScreen,
        navigationOptions:{
            tabBarLabel: 'Inativos'
        }
    }
},{
    initialRouteName: 'Active',
    tabBarComponent: (props)=>(
        <ColUI.TopTabNavigator {...props} />
    ),
    defaultNavigationOptions:{
        tabBarOptions:{
            upperCaseLabel: false,
            labelStyle:{
                fontSize: 16
            }
        }
    }
});

const ForHeader = createStackNavigator({
    Home: {
        screen: HomeTabs,
        navigationOptions:{
            title: 'Meus Eventos',
            header: ({navigation})=>{
                return <ColUI.Header navigation={navigation} title='Meus Eventos' />;
            }
        }
    },
    CreateDraft:{
        screen:DraftSwitch, //Leva para o Switch de DraftStack.js, que vai levar para o input do nome do evento
        navigationOptions:{
            header: null
        }
    },
    EventInfo:{
        screen: EventScreen,
        navigationOptions:{
            title: 'Evento',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Evento' />;
            }
        }
    },
    Metrics:{
        screen: MetricsTabs,
        navigationOptions:{
            title: 'Métricas',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Evento' />;
            }
        }
    },
    Profile:{
        screen: ProfileScreen,
        navigationOptions:{
            title: 'Perfil',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Perfil' />;
            }
        }
    }
},{
    initialRouteName: 'Home'
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
});

export default connect(mapStateToProps)(ForHeader);