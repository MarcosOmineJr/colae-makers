import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';

import { ExploreScreen, ProfileScreen } from '../screens';

import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const ExploreStack = createStackNavigator({
    Explore:{
        screen: ExploreScreen,
        navigationOptions:{
            title: 'Meus Eventos',
            header: ({navigation})=>{
                return <ColUI.Header navigation={navigation} title='Explorar' />;
            }
        }
    },
    ProfileStack:{
        screen: ProfileScreen,
        navigationOptions:{
            title: 'Perfil',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Perfil' />;
            }
        }
    }
},{
    initialRouteName: 'Explore'
});

export default ExploreStack;