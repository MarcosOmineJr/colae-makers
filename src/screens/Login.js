import React from 'react';
import { firebase } from '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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

const { ColUI } = ColaeAPI;

class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            disabled: true,
            email: '',
            password: ''
        }
        this._signOut = this._signOut.bind(this);
        this._login = this._login.bind(this);
        this._handleInput = this._handleInput.bind(this);

        this.authentication = firebase.auth();
        this.firestore = firebase.firestore();
        
        this.authentication.onAuthStateChanged(user=>{
            if(user){
                //Pegar as informações do usuário:
                this.firestore.doc('users/'+user.uid).get().then(userdata=>{
                    console.log('userdata:', userdata.data());
                }).catch(e=>{
                    console.log('Erro:', e.message);
                });
            }
        });
    }

    async _signOut(){
        try{
            await this.authentication.signOut();
        }catch(error){
            console.log('Erro:', error.message);
        }
    }
    
    async _login(){
        let s = this.state;
        try{
            await this.authentication.signInWithEmailAndPassword(s.email, s.password);
        } catch(error){
            switch(error.code){
                case 'auth/invalid-email':
                    alert('Insira um endereço de e-mail válido');
                    break;
                case 'auth/wrong-password':
                    alert('A senha digitada está errada!');
                    break;
                default:
                    alert(error.message);
            }
        }
    }

    _handleInput(input, mode){
        let s = this.state;
        s[mode] = input;
        if(s.email != '' && s.password != ''){
            s.disabled = false;
        } else {
            s.disabled = true;
        }
        this.setState(s);
    }

    componentDidMount(){
        this._signOut();
    }

    render(){

        const { ColUITheme } = this.props;
        const { disabled } = this.state;

        return (
            <KeyboardAwareScrollView
            resetScrollToCoords={{x:0, y:0}}
            contentContainerStyle={styles.container}
            scrollEnabled={false}
            >

                <ColaeAPI.ColUI.Background />
                <View style={styles.cardContainer}>
                    <ColaeAPI.ColUI.Card contentContainerStyle={styles.card}>
                        <Text style={{ fontSize: 40, color: ColUITheme.accent, marginBottom: '15%' }}>Login</Text>
                        <ColUI.TextInput keyboardType='email-address' label='E-mail' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'email')}} />
                        <ColUI.TextInput secureTextEntry={true} label='Senha' onChangeText={(t)=>{this._handleInput(t, 'password')}} />
                    </ColaeAPI.ColUI.Card>
                </View>
                <View style={styles.btnContainer}>
                    <ColaeAPI.ColUI.Button blue disabled={disabled} label='login' colSpan={4} onPress={()=>this._login()} />
                    <Button transparent onPress={()=>this.props.navigation.navigate('ForgotPassword')} >
                        <Text style={styles.btnLabel}>Esqueceu a senha?</Text>
                    </Button>
                    <Button transparent onPress={()=>this.props.navigation.navigate('SignUp')}>
                        <Text style={styles.btnLabel}>Não tenho uma conta!</Text>
                    </Button>
                </View>

            </KeyboardAwareScrollView>
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
        height: height*0.5,
        marginBottom: 10,
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
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
})

export default connect(mapStateToProps)(Login);