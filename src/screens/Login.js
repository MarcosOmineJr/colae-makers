import React from 'react';
import { firebase } from '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Alert
} from 'react-native';
import {
    Button
} from 'native-base';
import ColaeAPI from '../api';

const { width, height } = Dimensions.get('window');

const { ColUI } = ColaeAPI;

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            disabled: true,
            loading: false
        }

        this.unsubscribe = undefined;
        this.auth = firebase.auth();
        this.uid = '';

        this._handleInput = this._handleInput.bind(this);
        this._login = this._login.bind(this);
        this._signOut = this._signOut.bind(this);
        this._signInToFirebase = this._signInToFirebase.bind(this);
        this._putSubscription = this._putSubscription.bind(this);
    }

    _putSubscription(){
        this._signOut();
        this.unsubscribe = this.auth.onAuthStateChanged(user=>{
            if(user){
                this.uid = user.uid;
                try{
                    this._signInToFirebase();
                }catch(e){
                    console.log('Erro ao logar: ', e.message);
                }
            }
        })
    }

    async _signInToFirebase(){
        let userData = await firebase.firestore().doc(`users/${this.uid}`).get();
        userData = userData.data();
        this.props.setUserInfo({...userData, firebaseRef: this.uid});
        this.props.navigation.navigate('Authenticated');
    }

    async _signOut(){
        try{
            await this.auth.signOut();
        }catch(error){
            console.log('Erro ao deslogar:', error.message);
        }
    }

    _handleInput(input, mode){
        let s = this.state;

        if(mode == 'email'){
            s.email = input;
        } else {
            s.password = input;
        }

        if(s.email != '' && s.password != ''){
            s.disabled = false;
        } else {
            s.disabled = true;
        }

        this.setState(s);
    };

    async _login(){
        let s = this.state;
        s.loading = true;
        this.setState(s);

        try{
            await this.auth.signInWithEmailAndPassword(s.email, s.password);
        } catch(error){
            switch(error.code){
                case 'auth/invalid-email':
                    Alert.alert('Peraê!','Insira um endereço de e-mail válido');
                    break;
                case 'auth/wrong-password':
                    Alert.alert('Peraê!','A senha digitada está errada!');
                    break;
                default:
                    Alert.alert('Opa!', error.message);
            }
        }
    };

    render(){
        const { navigation, ColUITheme } = this.props;
        const { disabled, loading } = this.state;

        return (
            <View style={styles.container}>
                <NavigationEvents onWillBlur={()=>this.unsubscribe()} onDidFocus={this._putSubscription} />
                <ColaeAPI.ColUI.Background />
                <View style={styles.cardContainer}>
                    <ColaeAPI.ColUI.Card contentContainerStyle={styles.card}>
                        <Text style={{ fontSize: 40, color: ColUITheme.accent, marginBottom: '15%' }}>Login</Text>
                        <ColUI.TextInput autoCapitalize='none' keyboardType='email-address' label='E-mail' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'email')}} />
                        <ColUI.TextInput secureTextEntry={true} label='Senha' onChangeText={(t)=>{this._handleInput(t, 'password')}} />
                    </ColaeAPI.ColUI.Card>
                </View>
                <View style={styles.btnContainer}>
                    <ColaeAPI.ColUI.Button blue loading={loading} disabled={disabled} label='login' colSpan={4} onPress={()=>this._login()} />
                    <Button transparent onPress={()=>navigation.navigate('ForgotPassword')} >
                        <Text style={styles.btnLabel}>Esqueceu a senha?</Text>
                    </Button>
                    <Button transparent onPress={()=>navigation.navigate('SignUp')}>
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
        paddingVertical: '20%',
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

const mapDispatchToProps = (dispatch)=>({
    setUserInfo: payload=>dispatch({ type:'SET_USER_INFO', payload: payload })
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);