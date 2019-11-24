import React from 'react';

import { InConstructionScreen, SignUpScreens } from '../screens';

import { createStackNavigator } from 'react-navigation-stack';

import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const SignUp = createStackNavigator({
    SU_BasicInfo:{
        screen:SignUpScreens[0],
        navigationOptions:{
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Cadastro' />;
            }
        }
    },
    SU_Interests:{
        screen:SignUpScreens[1],
        navigationOptions:{
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Cadastro' />;
            }
        }
    },
    SU_Location:{
        screen:SignUpScreens[2],
        navigationOptions:{
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='Cadastro' />;
            }
        }
    },
    SU_LoginInfo:{
        screen:SignUpScreens[3],
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
    },
    SU_Privacidade:{
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