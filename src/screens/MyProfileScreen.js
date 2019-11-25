import React from 'react';

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
    }

    async _logOut(){
        await AsyncStorage.removeItem('@token');
        this.props.navigation.navigate('Login');
    }

    render(){
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <ColUI.Card colSpan={6} contentContainerStyle={styles.card}>
                    <View style={styles.profileImageContainer}>
                        <Image source={{uri: this.props.profile_image_url}} style={styles.profileImage} />
                    </View>
                    <View style={styles.InfoContainer}>
                        <Text style={styles.name}>{ this.props.name }</Text>
                        <Text>{ this.props.username }</Text>
                        <Text>de { this.props.location }</Text>
                    </View>
                </ColUI.Card>
                <ColUI.TextInput label='Nome' onChangeText={t=>this.props.setName(t)} />
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
        name: state.userReducer.name,
        username: state.userReducer.username,
        profile_image_url: state.userReducer.profile_image_url,
        location: state.userReducer.location,
        ColUITheme: state.themesReducer.ColUITheme
    };
}

const mapDispatchtoProps = (dispatch)=>{
    return {
        setName:(name) => dispatch({type: 'SET_NAME', payload: { name }})
    };
}

export default connect(mapStateToProps, mapDispatchtoProps)(MyProfileScreen);