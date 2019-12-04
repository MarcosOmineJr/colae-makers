import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ColaeAPI from '../api';
import { MetricsScreen, AvaliationsScreen } from '../screens';

const { ColUI } = ColaeAPI;

const MetricsTabs = createMaterialTopTabNavigator({
    Index:{
        screen: MetricsScreen,
        navigationOptions:{
            tabBarLabel: 'Dados Gerais'
        }
    },
    Avaliations:{
        screen: AvaliationsScreen,
        navigationOptions:{
            tabBarLabel: 'Avaliações'
        }
    }
},{
    initialRouteName: 'Index',
    tabBarComponent: (props)=>(
        <ColUI.TopTabNavigator {...props} />
    ),
    defaultNavigationOptions:{
        tabBarOptions:{
            upperCaseLabel: false,
            labelStyle:{
                fontSize: 16
            }
        }
    }
});

export default MetricsTabs;