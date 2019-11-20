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

const { ColUI } = ColaeAPI;

const { height, width } = Dimensions.get('window');

export default class Login extends React.Component {

    constructor(props){
        super(props);
        this._signUp= this._signUp.bind(this);
    }

    async _signUp(){
        await AsyncStorage.setItem('@token', 'eae man');
        this.props.navigation.navigate('Authenticated');
    }

    render(){
        return (
            <View style={styles.container}>
                <ColaeAPI.ColUI.Background />
                <View style={styles.cardContainer}>
                    <ColUI.Card contentContainerStyle={styles.card}>
                        <Text style={{color: ColUI.styles.lightTheme.accent, fontSize: 30}}>Cadastro 4</Text>
                    </ColUI.Card>
                </View>
                <View style={styles.btnContainer}>
                    <View style={styles.finishContainer}>
                        <ColUI.Button blue colSpan={4} label='finalizar cadastro' onPress={()=>this._signUp()} />
                        <Button transparent onPress={()=>this.props.navigation.navigate('SU_Termos')}>
                            <Text style={styles.warning}>Ao clicar em prosseguir você confirma que leu e concorda com o nosso Termo de Compromisso e Política de Privacidade (clique no aviso para ler)</Text>
                        </Button>
                    </View>
                    <View style={styles.loginContainer}>
                        <Button transparent onPress={()=>this.props.navigation.navigate('Login')}>
                            <Text style={styles.btnLabel}>Já tenho uma conta!</Text>
                        </Button>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardContainer:{
        flex: 2,
        width,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card:{
        height: height*0.504,
    },
    btnContainer:{
        flex: 1,
        width,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    finishContainer:{
        flex: 1,
        width,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    warning:{
        color: '#ffffff',
        textAlign: 'center'
    },
    loginContainer:{
        flex: 1,
        width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnLabel:{
        color: '#ffffff'
    }
});