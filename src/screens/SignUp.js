import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { firebase } from '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';
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
                lastname: '',
                whatsapp: ''
            },
            prevWhatsapp: ''
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

        if(s.data.profileimage != undefined && s.data.name != '' && s.data.lastname != '' && s.data.whatsapp != ''){
            s.disabled = true;
        } else {
            s.disabled = false
        }
        
        this.setState(s);
    }

    _handleInput(input, mode){
        let s = this.state;
        s.prevWhatsapp = s.data.whatsapp;
        s.data[mode] = input;
        if(s.data.profileimage != undefined && s.data.name != '' && s.data.lastname != '' && s.data.whatsapp != ''){
            s.disabled = false;
        } else {
            s.disabled = false;  //mudar aqui
        }
        if(mode == 'whatsapp'){
            function putWhatsAppThings(number){
                let unformatted = number;
                let plusIdentifier = unformatted.substr(0, 1);
                let final = '';
                let numberOnly = '';
                if (plusIdentifier !=  '+' && unformatted != ''){
                    final = '+55 (';
                    final += unformatted;
                } else if(unformatted.length == 7 && s.prevWhatsapp.length < unformatted.length){
                    final = unformatted + ') ';
                } else if(unformatted.length == 14 && s.prevWhatsapp.length < unformatted.length){
                    final = unformatted + '-';
                } else {
                    final = unformatted;
                }
                return final;
            }

            s.data[mode] = putWhatsAppThings(input.toString());
        }
        this.setState(s);
    }

    _nextPage(){
        let s = this.state;
        if(s.data.profileimage != undefined && s.data.name != '' && s.data.lastname != '' && s.data.whatsapp != ''){
            function removeWhatsAppThings(number){
                let countryCode = number.substr(1, 2);
                let ddd = number.substr(5, 2);
                let firstPart = number.substr(9, 5);
                let secondPart = number.substr(15, 4);

                return countryCode+ddd+firstPart+secondPart;
            }
            
            this.props.navigation.navigate('SU_Location', { data: {...s.data, whatsapp: removeWhatsAppThings(s.data.whatsapp) } });
        } else {
            alert('Preencha todos os campos!');
        }
    }

    render(){

        const { imagePath, disabled, data } = this.state;

        return (
            <View style={styles.container}>
                <ColaeAPI.ColUI.Background />
                <View style={styles.cardContainer}>
                    <ColUI.Card contentContainerStyle={styles.card}>
                        <ColUI.ProfileImageInput onPress={this._imageInputHandler} source={imagePath} />
                        <ColUI.TextInput autoCapitalize='words' label='Nome' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'name')}} />
                        <ColUI.TextInput autoCapitalize='words' label='Sobrenome' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'lastname')}} />
                        <ColUI.TextInput label='WhatsApp' value={data.whatsapp} placeholder='(11) 91234-5678' keyboardType='numeric' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'whatsapp')}} />
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
                        <ColUI.TextInput autoCapitalize='characters' label='Estado' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'state')}} />
                        <ColUI.TextInput autoCapitalize='words' label='Cidade' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'city')}} />
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

const SignUp4 = (props)=>{

    const { navigation } = props;
    const auth = firebase.auth();
    const firestore = firebase.firestore();

    const [disabled, setDisabled] = useState(true);
    const [data, setData] = useState({...navigation.state.params.data, username:''});
    const [loginInfo, setLoginInfo] = useState({email: '', password: ''});
    const [confirmPassword, setConfirmPassword] = useState('');

    async function _signOut(){
        try{
            await auth.signOut();
        }catch(error){
            console.log('Erro:', error.message);
        }
    }

    useEffect(()=>{
        _signOut();
        return auth.onAuthStateChanged((user)=>{
            if(user){
                try{
                    //Fazendo o upload da imagem de perfil no Storage:
                    async function fetchFirebase(){
                        let imagem = data.profileimage.path;
                        firebase.storage().ref(`profileimages/${user.uid}/profileimage`).putFile(imagem.replace('file://','')).on(firebase.storage.TaskEvent.STATE_CHANGED,snapshot=>{
                            if(snapshot.state === firebase.storage.TaskState.SUCCESS){
                                firebase.storage().ref(`profileimages/${user.uid}/profileimage`).getDownloadURL()
                                    .then((url)=>{

                                        //colocando em data a info certinha:
                                        setData({ ...data, email: loginInfo.email, firebaseRef: user.uid, profileimage: url, usertype: 'promoter', participatedin:[], phone: data.whatsapp });

                                        //recebendo o UID do usuário e criando o documento no Firestore:
                                        firestore.collection('users').doc(user.uid).set({ ...data, email: loginInfo.email, firebaseRef: user.uid, profileimage: url, usertype: 'promoter', participatedin:[], phone: data.whatsapp });

                                        //Guardando no Redux:
                                        props.setUserInfo({ ...data, email: loginInfo.email, firebaseRef: user.uid, profileimage: url, usertype: 'promoter', participatedin:[], phone: data.whatsapp });

                                        //Redirecionando para as rotas autenticadas:
                                        navigation.navigate('Authenticated');
                                    });
                            }
                        },error=>{
                            console.log('Erro:', error);
                        });
                    }
                    fetchFirebase();
                } catch(e){
                    console.log('Erro:', e);
                }
            }
        });
    });

    async function _signUp(){
        if(loginInfo.password == confirmPassword){
            try{
                await auth.createUserWithEmailAndPassword(loginInfo.email, loginInfo.password);

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

    function _handleInput(input, mode){
        switch(mode){
            case 'username':
                setData({...data, username: '@'+input });
                break;
            case 'confirmPassword':
                setConfirmPassword(input);
                break;
            case 'email':
                setLoginInfo({...loginInfo, email: input });
                break;
            case 'password':
                    setLoginInfo({...loginInfo, password: input });
                break;
        }
        if(data.username != '' && loginInfo.email != '' && loginInfo.password != '' && confirmPassword != ''){
            setDisabled(false);
        } else {
            setDisabled(true);
        }
        console.log('data em _handleInput', data);
    }

    return (
        <View style={styles.container}>
            <ColaeAPI.ColUI.Background />
            <View style={styles.cardContainer}>
                <ColUI.Card contentContainerStyle={styles.card}>
                    <ColUI.TextInput autoCapitalize='none' label='Nome de usuário (deve ser único)' style={{marginBottom: '10%'}} onChangeText={(t)=>{_handleInput(t, 'username')}} />
                    <ColUI.TextInput autocapitalize='none' keyboardType='email-address' label='E-mail' style={{marginBottom: '10%'}} onChangeText={(t)=>{_handleInput(t, 'email')}} />
                    <ColUI.TextInput secureTextEntry={true} label='Senha' style={{marginBottom: '10%'}} onChangeText={(t)=>{_handleInput(t, 'password')}} />
                    <ColUI.TextInput secureTextEntry={true} label='Confirmar senha' style={{marginBottom: '10%'}} onChangeText={(t)=>{_handleInput(t, 'confirmPassword')}} />
                </ColUI.Card>
            </View>
            <View style={styles.btnContainer}>
                <View style={styles.finishContainer}>
                    <ColUI.Button blue disabled={disabled} colSpan={4} label='finalizar cadastro' onPress={()=>_signUp()} />
                    <Text style={styles.warning}>Ao clicar em prosseguir você confirma que leu e concorda com os nossos <Text style={styles.inlineButton} onPress={()=>navigation.navigate('SU_Termos')}>Termos e Condições de Uso</Text> e <Text style={styles.inlineButton} onPress={()=>navigation.navigate('SU_Privacidade')}>Política de Privacidade</Text></Text>
                </View>
                <View style={styles.loginContainer}>
                    <Button transparent onPress={()=>navigation.navigate('Login')}>
                        <Text style={styles.btnLabel}>Já tenho uma conta!</Text>
                    </Button>
                </View>
            </View>
        </View>
    );
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