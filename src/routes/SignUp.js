import React from 'react';

import { SignUp1Screen, SignUp2Screen, SignUp3Screen, SignUp4Screen, InConstructionScreen } from '../screens';

import { createStackNavigator } from 'react-navigation-stack';

import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const SignUp = createStackNavigator({
    SU_BasicInfo:{
        screen:SignUp1Screen,
        navigationOptions:{
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Cadastro' />;
            }
        }
    },
    SU_Interests:{
        screen:SignUp2Screen,
        navigationOptions:{
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Cadastro' />;
            }
        }
    },
    SU_Location:{
        screen:SignUp3Screen,
        navigationOptions:{
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Cadastro' />;
            }
        }
    },
    SU_LoginInfo:{
        screen:SignUp4Screen,
        navigationOptions:{
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Cadastro' />;
            }
        }
    },
    SU_Termos:{
        screen: InConstructionScreen,
        navigationOptions:{
            title:'Em Construção',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Em Construção' />;
            }
        }
    }
},{
    initialRouteName: 'SU_BasicInfo'
});

export default SignUp;