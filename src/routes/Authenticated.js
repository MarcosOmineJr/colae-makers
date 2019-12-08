import React from 'react';

import { Icon } from 'native-base';
import Prancheta from '../assets/icons/exporte_prancheta.svg';
import Lupa from '../assets/icons/exporte_lupa.svg';
import Perfil from '../assets/icons/exporte_perfil.svg';

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
            tabBarIcon: ({focused})=>{ return focused ? <Prancheta width={30} height={30} fill='#EA1F5A' /> : <Prancheta width={30} height={30} fill='#AAAAAA' /> }
        }
    },
    Search:{
        screen: ExploreStack,
        navigationOptions:{
            tabBarLabel: 'Explorar',
            tabBarIcon: ({focused})=>{ return focused ? <Lupa width={30} height={30} fill='#EA1F5A' /> : <Lupa width={30} height={30} fill='#AAAAAA' /> }
        }
    },
    Profile:{
        screen: MyProfileStack,
        navigationOptions:{
            tabBarLabel: 'Meu Perfil',
            tabBarIcon: ({focused})=>{ return focused ? <Perfil width={30} height={30} fill='#EA1F5A' /> : <Perfil width={30} height={30} fill='#AAAAAA' /> }
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