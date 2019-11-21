import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';

import { MyProfileScreen } from '../screens';

import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const MyProfileStack = createStackNavigator({
    MyProfile:{
        screen: MyProfileScreen,
        navigationOptions:{
            title: 'Meu Perfil',
            header: ({navigation})=>{
                return <ColUI.Header navigation={navigation} title='meu perfil' />;
            }
        }
    }
},{
    initialRouteName: 'MyProfile'
});

export default MyProfileStack;