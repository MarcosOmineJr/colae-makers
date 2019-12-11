import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { firebase } from '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';
import { NavigationEvents } from 'react-navigation';
import ImagePicker from 'react-native-image-crop-picker';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Alert,
    ActivityIndicator
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
                profileimage: 'https://firebasestorage.googleapis.com/v0/b/colae-makers.appspot.com/o/profileimages%2Fdefault2.png?alt=media&token=a8063f71-f368-433d-9ce6-6ab94e7017d2',
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

        if(s.data.name != '' && s.data.lastname != '' && s.data.whatsapp != ''){
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
        if(s.data.name != '' && s.data.lastname != '' && s.data.whatsapp != ''){
            s.disabled = false;
        } else {
            s.disabled = true;
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
        if(s.data.name != '' && s.data.lastname != '' && s.data.whatsapp != ''){
            function removeWhatsAppThings(number){
                let countryCode = number.substr(1, 2);
                let ddd = number.substr(5, 2);
                let firstPart = number.substr(9, 5);
                let secondPart = number.substr(15, 4);

                return countryCode+ddd+firstPart+secondPart;
            }

            this.props.navigation.navigate('SU_Location', { data: {...s.data, whatsapp: removeWhatsAppThings(s.data.whatsapp) } });
        } else {
            Alert.alert('Esperaê!', 'Preencha todos os campos para poder prosseguir');
        }
    }

    render(){

        const { imagePath, disabled, data } = this.state;

        return (
            <View style={styles.container}>
                <ColaeAPI.ColUI.Background />
                <ColUI.Card contentContainerStyle={styles.card}>
                    <ColUI.ProfileImageInput edit onPress={this._imageInputHandler} source={imagePath} />
                    <ColUI.TextInput label='Nome' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'name')}} />
                    <ColUI.TextInput label='Sobrenome' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'lastname')}} />
                    <ColUI.TextInput label='WhatsApp' value={data.whatsapp} placeholder='(11) 91234-5678' keyboardType='numeric' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'whatsapp')}} />
                </ColUI.Card>
                <ColUI.Button blue disabled={disabled} colSpan={4} label='Próximo' onPress={this._nextPage} />
                <Button transparent onPress={()=>this.props.navigation.navigate('Login')}>
                    <Text style={styles.btnLabel}>Já tenho uma conta!</Text>
                </Button>
            </View>
        );
    }
}

class SignUp2 extends React.Component {

    render(){
        return (
            <View style={styles.container}>
                <ColaeAPI.ColUI.Background />
                <ColUI.Card contentContainerStyle={styles.card}>
                    <Text style={{color: this.props.ColUITheme.accent, fontSize: 30}}>Cadastro 2</Text>
                </ColUI.Card>
                <ColUI.Button blue colSpan={4} label='Próximo' onPress={()=>this.props.navigation.navigate('SU_Location')} />
                <Button transparent onPress={()=>this.props.navigation.navigate('Login')}>
                    <Text style={styles.btnLabel}>Já tenho uma conta!</Text>
                </Button>
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
                    state: undefined,
                    city: ''
                }
            },
            states: [],
            cities: false,
            loading: true
        }

        this._handleInput = this._handleInput.bind(this);
        this._nextPage = this._nextPage.bind(this);
        this._fetchStates = this._fetchStates.bind(this);
        //this._fetchCities = this._fetchCities.bind(this);
    }

    componentDidMount(){
        this._fetchStates();
    }

    async _fetchStates(){
        let s = this.state;
        let response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/regioes/1%7C2%7C3%7C4%7C5/estados');
        response = await response.json();
        s.states = response;
        s.loading = false;
        this.setState(s);
    }

    /*async _fetchCities(UF){
        let id;
        let s = this.state;
        s.states.map((state, key)=>{
            if(state.sigla == UF){
                id = state.id;
            }
        });
        let response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/'+id+'/municipios');
        response = await response.json();
        s.cities = response;
        s.loading = false;
        this.setState(s);
    }*/

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
            Alert.alert('Esperaê!', 'Preencha todos os campos!');
        }
    }

    render(){

        const { disabled, loading, states, data } = this.state;
        const { ColUITheme } = this.props;

        if(loading){
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} >
                    <ActivityIndicator size='large' color={ColUITheme.main} />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <ColaeAPI.ColUI.Background />
                <ColUI.Card contentContainerStyle={[styles.card, { paddingTop: '10%',alignItems: 'center', justifyContent: 'center' }]}>
                    <ColUI.Picker  state style={{marginBottom: '10%'}} pickerItems={states} value={data.from.state} onValueChange={(v)=>{this._handleInput(v, 'state')}} />
                    {false && cities && <ColUI.Picker  state style={{marginBottom: '10%'}} pickerItems={cities} value={test.city} onValueChange={(v)=>{this.setState({...this.state, test: {...this.state.test, city:v }})}} />}
                    <ColUI.TextInput label='Cidade' onChangeText={(t)=>{this._handleInput(t, 'city')}} />
                </ColUI.Card>
                <ColUI.Button blue disabled={disabled} colSpan={4} label='Próximo' onPress={this._nextPage} />
                <Button transparent onPress={()=>this.props.navigation.navigate('Login')}>
                    <Text style={styles.btnLabel}>Já tenho uma conta!</Text>
                </Button>
            </View>
        );
    }
}

class SignUp4 extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            disabled: true,
            loading: false,
            data: {
                ...props.navigation.state.params.data,
                username: ''
            },
            loginInfo: {
                email: '',
                password: ''
            },
            confirmPassword: ''
        }

        this.auth = firebase.auth();
        this.unsubscribe = undefined;
        this.uid = '';

        this._handleInput = this._handleInput.bind(this);
        this._signUp = this._signUp.bind(this);
        this._signOut = this._signOut.bind(this);
        this._saveOnStorageThenFirebase = this._saveOnStorageThenFirebase.bind(this);
        this._saveOnFirebase = this._saveOnFirebase.bind(this);
        this._putSubscription = this._putSubscription.bind(this);
    }

    _putSubscription(){
        this._signOut();
        this.unsubscribe = this.auth.onAuthStateChanged((new_user)=>{
            if(new_user){
               try{
                    this.uid = new_user.uid;

                    if(typeof this.state.data.profileimage !== 'string'){
                        this._saveOnStorageThenFirebase();
                    } else {
                        this._saveOnFirebase();
                    }
                } catch(e){
                    console.log('Erro ao logar:', e);
                }
            }
        });
    }

    async _saveOnStorageThenFirebase(){
        let s = this.state;
        let imagem = s.data.profileimage.path;

        //fazendo upload da imagem de perfil no storage:
        firebase.storage().ref(`profileimages/${this.uid}/profileimage`).putFile(imagem.replace('file://','')).on(firebase.storage.TaskEvent.STATE_CHANGED,snapshot=>{
            if(snapshot.state === firebase.storage.TaskState.SUCCESS){
                firebase.storage().ref(`profileimages/${this.uid}/profileimage`).getDownloadURL()
                    .then((url)=>{

                        let prepData = { ...s.data, profileimage: url, email: s.loginInfo.email, firebaseRef: this.uid, usertype: 'promoter', participatedin:[], phone: s.data.whatsapp };

                        //recebendo o UID do usuário e criando o documento no Firestore:
                        firebase.firestore().collection('users').doc(this.uid).set(prepData).then(()=>{
                            this.props.setUserInfo(prepData);


                            //Redirecionando para as rotas autenticadas:
                            this.props.navigation.navigate('Authenticated');
                        });
                    });
                }
            },error=>{
                console.log('Erro ao fazer upload de imagem:', error);
            });
    }

    async _saveOnFirebase(){
        let s = this.state;
        let prepData = { ...s.data, email: s.loginInfo.email, firebaseRef: this.uid, usertype: 'promoter', participatedin:[], phone: s.data.whatsapp };

        //recebendo o UID do usuário e criando o documento no Firestore:
        await firebase.firestore().collection('users').doc(this.uid).set(prepData);

        //Guardando no Redux:
        this.props.setUserInfo(prepData);


        //Redirecionando para as rotas autenticadas:
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
        switch(mode){
            case 'username':
                s.data.username = '@'+input;
                break;
            case 'confirmPassword':
                s.confirmPassword = input;
                break;
            case 'email':
                s.loginInfo.email = input;
                break;
            case 'password':
                s.loginInfo.password = input;
                break;
        }
        if(s.data.username != '' && s.loginInfo.email != '' && s.loginInfo.password != '' && s.confirmPassword != ''){
            s.disabled = false;
        } else {
            s.disabled = true;
        }
        this.setState(s);
    }

    async _signUp(){
        let s = this.state;


        if(s.loginInfo.password == s.confirmPassword){
            s.loading = true;
            this.setState(s);
            //A checagem de username deu ruim...
            //let usernameCheck = await firebase.firestore().collection('users').where('username', '==', s.data.username).get();
            //if(usernameCheck.empty){
                try{
                    await this.auth.createUserWithEmailAndPassword(s.loginInfo.email, s.loginInfo.password);
                } catch(error){
                    switch(error.code){
                        case 'auth/invalid-email':
                            Alert.alert('Esperaê!','Insira um endereço de e-mail válido');
                            s.loading = false;
                            break;
                        case 'auth/weak-password':
                            Alert.alert('Esperaê!','A senha precisa ter no mínimo 6 caracteres');
                            s.loading = false;
                            break;
                        case 'auth/email-already-in-use':
                            Alert.alert('Esperaê!','Esse endereço de e-mail já está cadastrado!');
                            s.loading = false;
                            break;
                        default:
                            Alert.alert('Esperaê!', error.message);
                            s.loading = false;
                    }
                }
            /*} else {
                Alert.alert('Opa!', 'Seu nome de usuário já está sendo usado');
                setLoading(false);
            }*/
        } else {
            Alert.alert('Esperaê!','A sua senha não coincide com a confirmação!');
            s.loading = false;
        }

        this.setState(s);
    }

    render(){

        const { navigation } = this.props;
        const { loading, disabled } = this.state;

        return (
            <View style={styles.container}>
                <NavigationEvents onWillBlur={()=>this.unsubscribe()} onDidFocus={this._putSubscription} />
                <ColaeAPI.ColUI.Background />
                <ColUI.Card contentContainerStyle={styles.card}>
                    <ColUI.TextInput autoCapitalize='none' label='Nome de usuário (deve ser único)' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'username')}} />
                    <ColUI.TextInput autoCapitalize='none' keyboardType='email-address' label='E-mail' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'email')}} />
                    <ColUI.TextInput secureTextEntry={true} label='Senha' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'password')}} />
                    <ColUI.TextInput secureTextEntry={true} label='Confirmar senha' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'confirmPassword')}} />
                </ColUI.Card>
                <View style={styles.finishContainer}>
                    <ColUI.Button blue loading={loading} disabled={disabled} colSpan={4} label='finalizar cadastro' onPress={()=>this._signUp()} />
                    <Text style={styles.warning}>Ao clicar em prosseguir você confirma que leu e concorda com os nossos <Text style={styles.inlineButton} onPress={()=>navigation.navigate('SU_Termos')}>Termos e Condições de Uso</Text> e <Text style={styles.inlineButton} onPress={()=>navigation.navigate('SU_Privacidade')}>Política de Privacidade</Text></Text>
                </View>
                <Button transparent onPress={()=>navigation.navigate('Login')}>
                    <Text style={styles.btnLabel}>Já tenho uma conta!</Text>
                </Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    card:{
        paddingVertical: '10%',
        justifyContent: 'flex-start'
    },
    btnLabel:{
        color: '#ffffff'
    },
    finishContainer:{
        height: '17.5%',
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
    ColUITheme: state.themesReducer.ColUITheme,
    userInfo: state.userReducer
})
const mapDispatchToProps = (dispatch)=>({
    setUserInfo: (userInfo) => dispatch({type: 'SET_USER_INFO', payload: userInfo})
});

const SU1 = connect(mapStateToProps)(SignUp1);
const SU2 = connect(mapStateToProps)(SignUp2);
const SU3 = connect(mapStateToProps)(SignUp3);
const SU4 = connect(mapStateToProps, mapDispatchToProps)(SignUp4);

export default [ SU1, SU2, SU3, SU4 ];