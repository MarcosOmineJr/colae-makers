import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    Dimensions
} from 'react-native';

import {
    Button
} from 'native-base';

import AsyncStorage from '@react-native-community/async-storage';

import ColaeAPI from '../api';

const { width, height } = Dimensions.get('window');

export default class Login extends React.Component {

    constructor(props){
        super(props);
        this._login = this._login.bind(this);
    }
    
   async _login(){
    await AsyncStorage.setItem('@token', 'eae man');
    this.props.navigation.navigate('Authenticated');
   }

    render(){
        return (
            <View style={styles.container}>
                <ColaeAPI.ColUI.Background />
                <View style={styles.cardContainer}>
                    <ColaeAPI.ColUI.Card contentContainerStyle={styles.card}>
                        <Text style={{color: ColaeAPI.ColUI.styles.lightTheme.accent, fontSize: 30}}>Login</Text>
                    </ColaeAPI.ColUI.Card>
                </View>
                <View style={styles.btnContainer}>
                    <ColaeAPI.ColUI.Button blue label='login' colSpan={4} onPress={()=>this._login()} />
                    <Button transparent onPress={()=>this.props.navigation.navigate('ForgotPassword')} >
                        <Text style={styles.btnLabel}>Esqueceu a senha?</Text>
                    </Button>
                    <Button transparent onPress={()=>this.props.navigation.navigate('SignUp')}>
                        <Text style={styles.btnLabel}>Não tenho uma conta!</Text>
                    </Button>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        paddingTop: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    cardContainer:{
        flex: 2,
        width,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card:{
        height: height*0.5144,
        marginBottom: 10
    },
    btnContainer:{
        flex: 1,
        width,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    btnLabel:{
        color: '#ffffff'
    }
});