import React from 'react';

import { Icon } from 'native-base';

import { createBottomTabNavigator } from 'react-navigation-tabs';

import HomeTabs from './HomeTabs';
import ExploreStack from './ExploreStack';
import MyProfileStack from './MyProfileStack';

import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const Authenticated = createBottomTabNavigator({
    Home:{
        screen: HomeTabs,
        navigationOptions:{
            tabBarLabel: 'Meus Eventos',
            tabBarIcon: ({focused})=>{return <Icon type="MaterialIcons" name="assignment" style={focused?{color: '#EA1F5A'}:{color:'#aaa'}} />}
        }
    },
    Search:{
        screen: ExploreStack,
        navigationOptions:{
            tabBarLabel: 'Explorar',
            tabBarIcon: ({focused})=>{return <Icon type="MaterialIcons" name="search" style={focused?{color: '#EA1F5A'}:{color:'#aaa'}} />}
        }
    },
    Profile:{
        screen: MyProfileStack,
        navigationOptions:{
            tabBarLabel: 'Meu Perfil',
            tabBarIcon: ({focused})=>{return <Icon type="MaterialIcons" name="account-circle" style={focused?{color: '#EA1F5A'}:{color:'#aaa'}} />}
        }
    }
},{
    initialRouteName: 'Home',
    tabBarComponent: (props) => (
        <ColUI.BottomTabNavigator {...props} />
    ),
    defaultNavigationOptions:{
        resetOnBlur: true
    }
});



export default Authenticated;