import React from 'react';

import { connect } from 'react-redux';

import {
    View,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class AuthCheck extends React.Component {
    
    constructor(props){
        super(props);
        this._checkAuthentication = this._checkAuthentication.bind(this);
    }

    componentDidMount(){
        this._checkAuthentication();
    }

    async _checkAuthentication(){
        let token = await AsyncStorage.getItem('@token');
        if(token != null){
            this.props.navigation.navigate('Authenticated');
        } else {
            this.props.navigation.navigate('Unauthenticated');
        }
    }

    render(){
        return (
            <View style={[styles.container, {backgroundColor: this.props.ColUITheme.background}]}>
                <ActivityIndicator size='large' color={this.props.ColUITheme.main} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text:{
        fontSize: 30
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

export default connect(mapStateToProps, mapDispatchToProps)(AuthCheck);