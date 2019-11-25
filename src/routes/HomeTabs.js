import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { connect } from 'react-redux';
import DraftSwitch from './DraftStack';
import FilterStack from './FilterStack';
import { InConstructionScreen, ActiveScreen, DraftsScreen } from '../screens';
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
        screen:DraftsScreen,
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
    CreateDraft:{
        screen:DraftSwitch,
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