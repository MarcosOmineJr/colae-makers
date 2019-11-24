import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { HomeScreen } from '../screens';
import CreateEventStack from './CreateEventStack';
import FilterStack from './FilterStack';
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
    },
    CreateEvent:{
        screen:CreateEventStack,
        navigationOptions:{
            header: null
        }
    },
    Filter:{
        screen:FilterStack,
        navigationOptions:{
            header: null
        }
    }
}, {
    initialRouteName: 'Home'
});

export default HomeStack;