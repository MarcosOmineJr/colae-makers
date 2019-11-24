import React from 'react';
import { createMaterialTopTabNavigator, MaterialTopTabBar } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { connect } from 'react-redux';
import CreateEventStack from './CreateEventStack';
import FilterStack from './FilterStack';
import { InConstructionScreen, ActiveScreen } from '../screens';
import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const HomeTabs = createMaterialTopTabNavigator({
    Active:{
        screen: ActiveScreen,
        navigationOptions: {
            tabBarLabel: 'Ativos'
        }
    },
    Drafts:{
        screen:InConstructionScreen,
        navigationOptions:{
            tabBarLabel: 'Rascunhos'
        }
    },
    Inactive:{
        screen:InConstructionScreen,
        navigationOptions:{
            tabBarLabel: 'Inativos'
        }
    }
},{
    initialRouteName: 'Active',
    tabBarComponent: (props)=>(
        <ColUI.TopTabNavigator {...props} />
    )
});

const ForHeader = createStackNavigator({
    Home: {
        screen: HomeTabs,
        navigationOptions:{
            title: 'Meus Eventos',
            header: ({navigation})=>{
                return <ColUI.Header navigation={navigation} title='Meus Eventos' />;
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
},{
    initialRouteName: 'Home'
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
});

export default connect(mapStateToProps)(ForHeader);