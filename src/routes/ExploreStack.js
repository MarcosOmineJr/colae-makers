import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';

import { ExploreScreen } from '../screens';

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
    }
},{
    initialRouteName: 'Explore'
});

export default ExploreStack;