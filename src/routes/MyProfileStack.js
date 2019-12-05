import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';

import { MyProfileScreen, ProfileScreen } from '../screens';

import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const MyProfileStack = createStackNavigator({
    MyProfile:{
        screen: MyProfileScreen,
        navigationOptions:{
            title: 'Meu Perfil',
            header: ({navigation})=>{
                return <ColUI.Header navigation={navigation} title='Meu Perfil' />;
            }
        }
    },
    Profile:{
        screen:ProfileScreen,
        navigationOptions:{
            title: 'Perfil',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Perfil' />;
            }
        }
    }
},{
    initialRouteName: 'MyProfile'
});

export default MyProfileStack;