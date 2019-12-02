import React from 'react';
import { firebase } from '@react-native-firebase/auth';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image
} from 'react-native';

import { connect } from 'react-redux';

import AsyncStorage from '@react-native-community/async-storage';

import ColaeAPI from '../api';

const { width } = Dimensions.get('window');

const { ColUI } = ColaeAPI;

class MyProfileScreen extends React.Component {

    constructor(props){
        super(props);

        this._logOut = this._logOut.bind(this);

        this.authentication = firebase.auth();
        
        this.authentication.onAuthStateChanged(user=>{
            if(!user){
                props.navigation.navigate('Login');
            }
        });
    }

    async _logOut(){
        this.authentication.signOut();
    }

    render(){

        const { user } = this.props;

        return (
            <ScrollView contentContainerStyle={styles.container}>
                <ColUI.Card colSpan={6} contentContainerStyle={styles.card}>
                    <View style={styles.profileImageContainer}>
                        <Image source={{uri: user.profileimage}} style={styles.profileImage} />
                    </View>
                    <View style={styles.InfoContainer}>
                        <Text style={styles.name}>{ user.name+' '+user.lastname }</Text>
                        <Text>{ user.username }</Text>
                        <Text>de { user.from.city+' - '+user.from.state }</Text>
                    </View>
                </ColUI.Card>
                <ColUI.TextInput label='Nome' onChangeText={()=>{}} />
                <ColUI.Button colSpan={4} label='sair' onPress={()=>this._logOut()} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card:{
        flexDirection: 'row',
        marginBottom: 20
    },
    profileImageContainer:{
        flex: 2
    },
    profileImage:{
        height: 100,
        width: 100,
        borderRadius: 50
    },
    InfoContainer: {
        flex: 3,
        justifyContent: 'space-between'
    },
    name:{
        fontSize: 20,
        fontWeight: 'bold'
    }
});

const mapStateToProps = (state)=>{
    return {
        user: state.userReducer,
        ColUITheme: state.themesReducer.ColUITheme
    };
}

export default connect(mapStateToProps)(MyProfileScreen);