import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { InConstructionScreen } from '../screens';
import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const FilterStack = createStackNavigator({
    Filter:{
        screen:InConstructionScreen,
        navigationOptions:{
            title: 'Filtrar',
            header: ({navigation})=>{
                return <ColUI.Header noAuth navigation={navigation} title='filtrar' />;
            }
        }
    }
});

export default FilterStack;