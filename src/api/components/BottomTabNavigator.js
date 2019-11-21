import React from 'react';

import { connect } from 'react-redux';

import {
    StyleSheet,
    Dimensions
} from 'react-native';

import { BottomTabBar } from 'react-navigation-tabs';

import { shadow } from './styles';

const { height } = Dimensions.get('window');

class BottomTabNavigator extends React.Component {
    
    constructor(props){
        super(props);
    }

    render(){
        return (
            <BottomTabBar inactiveTintColor='rgba(255,255,255,0.7)' activeTintColor='#FFFFFF' {...this.props} style={[styles.container, { backgroundColor: this.props.ColUITheme.main }, shadow]} />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: height*0.1,
        paddingBottom: height*0.0114,
        borderTopColor: 'transparent'
    }
});

const mapStateToProps = (state)=>{
    return {
        ColUITheme: state.themesReducer.ColUITheme
    };
}

const mapDispatchToProps = (dispatch)=>{
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(BottomTabNavigator);