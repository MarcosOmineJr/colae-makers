import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';

import { InConstructionScreen, OnboardingScreen, LoginScreen } from '../screens';

import SignUp from './SignUp';

import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const Unauthenticated = createStackNavigator({
    Onboarding: {
        screen: OnboardingScreen,
        navigationOptions: {
            header: null
        }
    },
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            title: 'login',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Login' />;
            }
        }
    },
    SignUp:{
        screen: SignUp,
        navigationOptions:{
            header: null
        }
    },
    ForgotPassword:{
        screen: InConstructionScreen,
        navigationOptions:{
            title:'Em Construção',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Em Construção' />;
            }
        }
    }
},{
    initialRouteName:'Onboarding'
});

export default Unauthenticated;