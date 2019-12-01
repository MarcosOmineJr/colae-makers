import React from 'react';
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
            username: '',
            password: ''
        }
        this._login = this._login.bind(this);
        this._handleInput = this._handleInput.bind(this);

    }
    
    async _login(){
        await AsyncStorage.setItem('@token', 'eae man');
        this.props.navigation.navigate('Authenticated');

        //Mandar para o firebase auth
    }

    _handleInput(input, mode){
        let s = this.state;
        s[mode] = input;
        this.setState(s);
    }

    render(){

        const { ColUITheme } = this.props;

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
                        <ColUI.TextInput label='Nome de Usuário' style={{marginBottom: '10%'}} onChangeText={(t)=>{this._handleInput(t, 'username')}} />
                        <ColUI.TextInput secureTextEntry={true} label='Senha' onChangeText={(t)=>{this._handleInput(t, 'password')}} />
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