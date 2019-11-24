import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';

import { InConstructionScreen } from '../screens';

import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const ExploreStack = createStackNavigator({
    Explore:{
        screen: InConstructionScreen,
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