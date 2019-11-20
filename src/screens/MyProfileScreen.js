import React from 'react';

import {
    StyleSheet,
    View
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

export default class MyProfileScreen extends React.Component {

    constructor(props){
        super(props);

        this._logOut = this._logOut.bind(this);
    }

    async _logOut(){
        await AsyncStorage.removeItem('@token');
        this.props.navigation.navigate('Login');
    }

    render(){
        return (
            <View style={styles.container}>
                <ColUI.Button colSpan={4} label='sair' onPress={()=>this._logOut()} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});