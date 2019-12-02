import React from 'react';
import { connect } from 'react-redux';
import { firebase } from '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import {
    StyleSheet,
    View,
    Text,
    Dimensions
} from 'react-native';
import {
    Button
} from 'native-base';
import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;

const { height, width } = Dimensions.get('window');

class SignUp1 extends React.Component {

    constructor(props){
        super(props);
        this.state={
            disabled: true,
            imagePath: undefined,
            data:{
                profileimage: undefined,
                name: '',
                lastname: ''
            }
        }

        this._imageInputHandler = this._imageInputHandler.bind(this);
        this._handleInput = this._handleInput.bind(this);
        this._nextPage = this._nextPage.bind(this);
    }

    async _imageInputHandler(){
        let s = this.state;

        try {
            let image = await ImagePicker.openPicker({
                width: 400,
                height: 400,
                cropping: true
            });

            s.data.profileimage = image;
            s.imagePath = {uri: image.path}

        } catch(e){
            console.log('erro:', e);
        }

        if(s.data.profileimage != undefined && s.data.name != '' && s.data.lastname != ''){
            s.disabled = true;
        } else {
            s.disabled = false
        }
        
        this.setState(s);
    }

    _handleInput(input, mode){
        let s = this.state;
        s.data[mode] = input;
        if(s.data.profileimage != undefined && s.data.name != '' && s.data.lastname != ''){
            s.disabled = false;
        } else {
            s.disabled = true;
        }
        this.setState(s);
    }

    _nextPage(){
        let s = this.state;
        if(s.data.profileimage != undefined && s.data.name != '' && s.data.lastname != ''){
            this.props.navigation.navigate('SU_Location', { data: s.data });
        } else {
            alert('Preencha todos os campos!');
        }
    }

    render(){

        const { imagePath, disabled } = this.state;

        return (
            <View style={styles.container}>
                <ColaeAPI.ColUI.Background />
                <View style={styles.cardContainer}>
                    <ColUI.Card contentContainerStyle={styles.card}>
                        <ColUI.ProfileImageInput onPress={this._imageInputHandler} source={imagePath} />
                        <ColUI.TextInput label='Nome' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'name')}} />
                        <ColUI.TextInput label='Sobrenome' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'lastname')}} />
                    </ColUI.Card>
                </View>
                <View style={styles.btnContainer}>
                    <ColUI.Button blue disabled={disabled} colSpan={4} label='Próximo' onPress={this._nextPage} />
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

    constructor(props){
        super(props);
        this.state = {
            disabled: true,
            data:{
                ...props.navigation.state.params.data,
                from:{
                    state: '',
                    city: ''
                }
            }
        }

        this._handleInput = this._handleInput.bind(this);
        this._nextPage = this._nextPage.bind(this);
    }

    _handleInput(input, mode){
        let s = this.state;
        s.data.from[mode] = input;
        if(s.data.from.state != '' && s.data.from.city != ''){
            s.disabled = false;
        } else {
            s.disabled = true;
        }
        this.setState(s);
    }

    _nextPage(){
        let s = this.state;
        if(s.data.from.city != '' && s.data.from.state != ''){
            this.props.navigation.navigate('SU_LoginInfo', { data: s.data });
        } else {
            alert('Preencha todos os campos!');
        }
    }

    render(){

        const { disabled } = this.state;

        return (
            <View style={styles.container}>
                <ColaeAPI.ColUI.Background />
                <View style={styles.cardContainer}>
                    <ColUI.Card contentContainerStyle={[styles.card, { justifyContent: 'center' }]}>
                        <ColUI.TextInput label='Estado' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'state')}} />
                        <ColUI.TextInput label='Cidade' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'city')}} />
                    </ColUI.Card>
                </View>
                <View style={styles.btnContainer}>
                    <ColUI.Button blue disabled={disabled} colSpan={4} label='Próximo' onPress={this._nextPage} />
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
        this.state = {
            disabled: true,
            data: {
                ...props.navigation.state.params.data,
                username: ''
            },
            loginInfo:{
                email: '',
                password: ''
            },
            confirmPassword:''
        }
        this._signOut = this._signOut.bind(this);
        this._signUp = this._signUp.bind(this);
        this._handleInput = this._handleInput.bind(this);

        this.authentication = firebase.auth();
        this.firestore = firebase.firestore();
        this.storage = firebase.storage();
        console.log('userData recebido', props.navigation.state.params.data);

        this.authentication.onAuthStateChanged(user=>{
            if(user){
                //recebendo o UID do usuário e criando o documento no Firestore:
                this.firestore.collection('users').doc(user.uid).set({ ...this.state.data, email: this.state.loginInfo.email});

                //Fazendo o upload da imagem de perfil no Storage:
                //Não deu certo, desisto:
                this.state.data.profileimage = this.state.data.profileimage.path;

                //Guardando no Redux:
                props.setUserInfo({ ...this.state.data, email: this.state.loginInfo.email, firebaseRef: user.uid });
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

    componentDidMount(){
        //deslogando qualquer usuário que por ventura esteja logado ainda:
        this._signOut();
    }

    async _signUp(){
        let s = this.state;
        console.log(s.data);
        if(s.loginInfo.password == s.confirmPassword){
            try{
                await this.authentication.createUserWithEmailAndPassword(s.loginInfo.email, s.loginInfo.password);

            } catch(error){
                switch(error.code){
                    case 'auth/invalid-email':
                        alert('Insira um endereço de e-mail válido');
                        break;
                    case 'auth/weak-password':
                        alert('A senha precisa ter no mínimo 6 caracteres');
                        break;
                    case 'auth/email-already-in-use':
                        alert('Esse endereço de e-mail já está cadastrado!');
                        break;
                    default:
                        alert(error.message);
                }
            }
        } else {
            alert('A sua senha não coincide com a confirmação!');
        }
    }

    _handleInput(input, mode){
        let s = this.state;
        switch(mode){
            case 'username':
                s.data[mode] = '@' + input;
            case 'confirmPassword':
                s[mode] = input;
                break;
            default:
                s.loginInfo[mode] = input;
                break;
        }
        if(s.data.username != '' && s.loginInfo.email != '' && s.loginInfo.password != '' && s.confirmPassword != ''){
            s.disabled = false;
        } else {
            s.disabled = true;
        }

        this.setState(s);
    }

    render(){

        const { disabled } = this.state;

        return (
            <View style={styles.container}>
                <ColaeAPI.ColUI.Background />
                <View style={styles.cardContainer}>
                    <ColUI.Card contentContainerStyle={styles.card}>
                        <ColUI.TextInput label='Nome de usuário (deve ser único)' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'username')}} />
                        <ColUI.TextInput keyboardType='email-address' label='E-mail' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'email')}} />
                        <ColUI.TextInput secureTextEntry={true} label='Senha' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'password')}} />
                        <ColUI.TextInput secureTextEntry={true} label='Confirmar senha' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'confirmPassword')}} />
                    </ColUI.Card>
                </View>
                <View style={styles.btnContainer}>
                    <View style={styles.finishContainer}>
                        <ColUI.Button blue disabled={disabled} colSpan={4} label='finalizar cadastro' onPress={()=>this._signUp()} />
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

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
})
const mapDispatchToProps = (dispatch)=>({
    setUserInfo: (userInfo) => dispatch({type: 'SET_USER_INFO', payload: userInfo})
});

const SU1 = connect(mapStateToProps)(SignUp1);
const SU2 = connect(mapStateToProps)(SignUp2);
const SU3 = connect(mapStateToProps)(SignUp3);
const SU4 = connect(mapStateToProps, mapDispatchToProps)(SignUp4);

export default [ SU1, SU2, SU3, SU4 ];