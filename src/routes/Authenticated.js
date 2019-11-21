import React from 'react';

import { Icon } from 'native-base';

import { createBottomTabNavigator } from 'react-navigation-tabs';

import HomeStack from './HomeStack';
import ExploreStack from './ExploreStack';
import ChatsStack from './ChatsStack';
import MyProfileStack from './MyProfileStack';

import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const Authenticated = createBottomTabNavigator({
    Home:{
        screen: HomeStack,
        navigationOptions:{
            tabBarLabel: 'Meus Eventos',
            tabBarIcon: ({focused})=>{return <Icon type="MaterialIcons" name="assignment" style={focused?{color: '#ffffff'}:{color:'rgba(255,255,255,0.7)'}} />}
        }
    },
    Search:{
        screen: ExploreStack,
        navigationOptions:{
            tabBarLabel: 'Explorar',
            tabBarIcon: ({focused})=>{return <Icon type="MaterialIcons" name="search" style={focused?{color: '#ffffff'}:{color:'rgba(255,255,255,0.7)'}} />}
        }
    },
    Chat:{
        screen: ChatsStack,
        navigationOptions:{
            tabBarLabel: 'Conversas',
            tabBarIcon: ({focused})=>{return <Icon type="MaterialIcons" name="message" style={focused?{color: '#ffffff'}:{color:'rgba(255,255,255,0.7)'}} />}
        }
    },
    Profile:{
        screen: MyProfileStack,
        navigationOptions:{
            tabBarLabel: 'Meu Perfil',
            tabBarIcon: ({focused})=>{return <Icon type="MaterialIcons" name="account-circle" style={focused?{color: '#ffffff'}:{color:'rgba(255,255,255,0.7)'}} />}
        }
    }
},{
    initialRouteName: 'Home',
    tabBarComponent: (props) => (
        <ColUI.BottomTabNavigator {...props} />
    )
});



export default Authenticated;