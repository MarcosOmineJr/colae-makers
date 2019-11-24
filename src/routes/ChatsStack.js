import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';

import { InConstructionScreen } from '../screens';

import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const ChatsStack = createStackNavigator({
    Chats:{
        screen: InConstructionScreen,
        navigationOptions:{
            title: 'Conversas',
            header: ({navigation})=>{
                return <ColUI.Header navigation={navigation} title='Conversas' />;
            }
        }
    }
},{
    initialRouteName: 'Chats'
});

export default ChatsStack;