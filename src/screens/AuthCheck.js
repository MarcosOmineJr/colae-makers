import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import ColaeAPI from '../api';

export default class AuthCheck extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            theme: ColaeAPI.ColUI.styles.lightTheme
        }
        this._getTheme = this._getTheme.bind(this);
    }

    componentDidMount(){
        this._getTheme();
        this._checkAuthentication();
    }

    async _getTheme(){
        let s = this.state;
        s.theme = await ColaeAPI.ColUI.styles.getColorTheme();
        this.setState(s);
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
            <View style={[styles.container, {backgroundColor: this.state.theme.background}]}>
                <ActivityIndicator size='large' color={this.state.theme.main} />
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