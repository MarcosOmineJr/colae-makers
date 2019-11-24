import React from 'react';

import { connect } from 'react-redux';

import {
    StyleSheet,
    Dimensions
} from 'react-native';

import { MaterialTopTabBar } from 'react-navigation-tabs';

import { shadow } from './styles';

const { height } = Dimensions.get('window');

class BottomTabNavigator extends React.Component {
    
    constructor(props){
        super(props);
    }

    render(){
        return (
            <MaterialTopTabBar inactiveTintColor='#999' indicatorStyle={{backgroundColor: this.props.ColUITheme.main}}  activeTintColor={this.props.ColUITheme.main} {...this.props} style={[styles.container, shadow]} />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent'
    }
});

const mapStateToProps = (state)=>{
    return {
        ColUITheme: state.themesReducer.ColUITheme
    };
}

export default connect(mapStateToProps)(BottomTabNavigator);