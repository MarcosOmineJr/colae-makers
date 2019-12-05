import React, { useState, useEffect } from 'react';
import { firebase } from '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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

const Login = (props)=>{

    const { navigation, ColUITheme, setUserInfo } = props;

    const [disabled, setDisabled] = useState(true);
    const [loginInfo, setLoginInfo] = useState({email: '', password: ''});

    const auth = firebase.auth();
    const firestore = firebase.firestore();

    useEffect(()=>{
        return auth.onAuthStateChanged(user=>{

            async function fetchFirebase(){
                if(user){
                    try{
                        let userData = await firestore.doc('users/'+user.uid).get();
                        userData = userData.data();
                        setUserInfo({...userData, firebaseRef: user.uid });
                    } catch(e){
                        console.log('Erro:', e);
                    }
                }
            }

            fetchFirebase();
        })
    }, []);

    function _handleInput(input, mode){

        if(mode == 'email'){
            setLoginInfo({...loginInfo, email: input});
        } else {
            setLoginInfo({...loginInfo, password: input});
        }

        if(loginInfo.email != '' && loginInfo.password != ''){
            setDisabled(false);
        } else {
            setDisabled(true);
        }

    };

    async function _login(){
        try{
            await auth.signInWithEmailAndPassword(loginInfo.email, loginInfo.password);
        } catch(error){
            switch(error.code){
                case 'auth/invalid-email':
                    Alert.alert('Peraê!','Insira um endereço de e-mail válido');
                    break;
                case 'auth/wrong-password':
                    Alert.alert('Peraê!','A senha digitada está errada!');
                    break;
                default:
                    alert(error.message);
            }
        }
    };

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
                    <ColUI.TextInput keyboardType='email-address' label='E-mail' style={{marginBottom: '10%'}} onChangeText={(t)=>{_handleInput(t, 'email')}} />
                    <ColUI.TextInput secureTextEntry={true} label='Senha' onChangeText={(t)=>{_handleInput(t, 'password')}} />
                </ColaeAPI.ColUI.Card>
            </View>
            <View style={styles.btnContainer}>
                <ColaeAPI.ColUI.Button blue disabled={disabled} label='login' colSpan={4} onPress={()=>_login()} />
                <Button transparent onPress={()=>navigation.navigate('ForgotPassword')} >
                    <Text style={styles.btnLabel}>Esqueceu a senha?</Text>
                </Button>
                <Button transparent onPress={()=>navigation.navigate('SignUp')}>
                    <Text style={styles.btnLabel}>Não tenho uma conta!</Text>
                </Button>
            </View>

        </KeyboardAwareScrollView>
    );
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

const mapDispatchToProps = (dispatch)=>({
    setUserInfo: payload=>dispatch({ type:'SET_USER_INFO', payload: payload })
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);