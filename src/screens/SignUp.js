import React from 'react';
import { connect } from 'react-redux';
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

class SignUp1 extends React.Component {
    render(){
        return (
            <View style={styles.container}>
                <ColaeAPI.ColUI.Background />
                <View style={styles.cardContainer}>
                    <ColUI.Card contentContainerStyle={styles.card}>
                        <Text style={{color: this.props.ColUITheme.accent, fontSize: 30}}>Cadastro 1</Text>
                        <ColUI.ImageInput />
                    </ColUI.Card>
                </View>
                <View style={styles.btnContainer}>
                    <ColUI.Button blue colSpan={4} label='Próximo' onPress={()=>this.props.navigation.navigate('SU_Interests')} />
                    <Button transparent onPress={()=>this.props.navigation.navigate('Login')}>
                        <Text style={styles.btnLabel}>Já tenho uma conta!</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

class SignUp2 extends React.Component {
    render(){
        return (
            <View style={styles.container}>
                <ColaeAPI.ColUI.Background />
                <View style={styles.cardContainer}>
                    <ColUI.Card contentContainerStyle={styles.card}>
                        <Text style={{color: this.props.ColUITheme.accent, fontSize: 30}}>Cadastro 2</Text>
                    </ColUI.Card>
                </View>
                <View style={styles.btnContainer}>
                    <ColUI.Button blue colSpan={4} label='Próximo' onPress={()=>this.props.navigation.navigate('SU_Location')} />
                    <Button transparent onPress={()=>this.props.navigation.navigate('Login')}>
                        <Text style={styles.btnLabel}>Já tenho uma conta!</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

class SignUp3 extends React.Component {
    render(){
        return (
            <View style={styles.container}>
                <ColaeAPI.ColUI.Background />
                <View style={styles.cardContainer}>
                    <ColUI.Card contentContainerStyle={styles.card}>
                        <Text style={{color: this.props.ColUITheme.accent, fontSize: 30}}>Cadastro 3</Text>
                    </ColUI.Card>
                </View>
                <View style={styles.btnContainer}>
                    <ColUI.Button blue colSpan={4} label='Próximo' onPress={()=>this.props.navigation.navigate('SU_LoginInfo')} />
                    <Button transparent onPress={()=>this.props.navigation.navigate('Login')}>
                        <Text style={styles.btnLabel}>Já tenho uma conta!</Text>
                    </Button>
                </View>
            </View>
        );
    }
}

class SignUp4 extends React.Component {

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
                        <Text style={{color: this.props.ColUITheme.accent, fontSize: 30}}>Cadastro 4</Text>
                    </ColUI.Card>
                </View>
                <View style={styles.btnContainer}>
                    <View style={styles.finishContainer}>
                        <ColUI.Button blue colSpan={4} label='finalizar cadastro' onPress={()=>this._signUp()} />
                        <Text style={styles.warning}>Ao clicar em prosseguir você confirma que leu e concorda com os nossos <Text style={styles.inlineButton} onPress={()=>this.props.navigation.navigate('SU_Termos')}>Termos e Condições de Uso</Text> e <Text style={styles.inlineButton} onPress={()=>this.props.navigation.navigate('SU_Privacidade')}>Política de Privacidade</Text></Text>
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
        justifyContent: 'flex-start'
    },
    btnContainer:{
        flex: 1,
        width,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    btnLabel:{
        color: '#ffffff'
    },
    finishContainer:{
        flex: 1,
        width,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 50
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
    },
    inlineButton:{
        color: '#cccccc',
        textDecorationLine: 'underline'
    }
});

const mapStateToProps = (state)=>{
    return {
        ColUITheme: state.themesReducer.ColUITheme
    };
}

const SU1 = connect(mapStateToProps)(SignUp1);
const SU2 = connect(mapStateToProps)(SignUp2);
const SU3 = connect(mapStateToProps)(SignUp3);
const SU4 = connect(mapStateToProps)(SignUp4);

export default [ SU1, SU2, SU3, SU4 ];