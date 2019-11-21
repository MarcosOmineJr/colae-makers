import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';

import { HomeScreen } from '../screens';

import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const HomeStack = createStackNavigator({
    Home:{
        screen: HomeScreen,
        navigationOptions:{
            title: 'Meus Eventos',
            header: ({navigation})=>{
                return <ColUI.Header navigation={navigation} title='meus eventos' />;
            }
        }
    }
}, {
    initialRouteName: 'Home'
});

export default HomeStack;