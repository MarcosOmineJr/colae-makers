import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import ColaeAPI from '../api';
import { Button, Textarea } from 'native-base';
import {
    StyleSheet,
    Dimensions,
    ScrollView,
    View,
    Text
} from 'react-native';

const { width, height } = Dimensions.get('screen');
const { ColUI } = ColaeAPI;

const GridWidth = (colSpan)=>((width*0.1027)*colSpan)+((width*0.055)*(colSpan-1));

const EditProfileInfo = props=>{

    const { ColUITheme, userData, navigation } = props;

    return (
        <View>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.basicInfoContainer}>
                    <View style={styles.imageContainer}>
                        <ColUI.ProfileImageInput edit source={{uri: userData.profileimage}} />
                    </View>
                    <View style={styles.inputsContainer}>
                        <ColUI.TextInput colSpan={3.8}label='Nome' value={`${userData.name} ${userData.lastname}`} />
                        <ColUI.TextInput colSpan={3.8}label='@nome_de_usuario' value={`${userData.username}`} />
                        <ColUI.TextInput colSpan={3.8}label='Estado' value={`${userData.from.state}`} />
                        <ColUI.TextInput colSpan={3.8}label='Cidade' value={`${userData.from.city}`} />
                        <Button transparent style={{ alignSelf: 'flex-end', marginBottom: 10 }} onPress={()=>navigation.navigate('ChangePassword')}>
                            <Text style={[styles.link, { color: ColUITheme.main }]}>Alterar Senha</Text>
                        </Button>
                    </View>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={[styles.title, { color: ColUITheme.gray.light }]}>Sobre</Text>
                    <Textarea
                    rowSpan={10}
                    bordered 
                    placeholder={userData.about ? '' : 'Fale um pouco sobre você'}
                    style={[styles.textArea, { borderColor: ColUITheme.main }]}
                    onChangeText={()=>{}}
                    value={userData.about ? userData.about : ''}
                    />
                </View>
            </ScrollView>
            <View style={styles.buttonsContainer}>
                <ColUI.Button label='confirmar' />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        padding: 20
    },
    basicInfoContainer:{
        flex: 1,
        width: width-40,
        borderBottomWidth: 1,
        flexDirection: 'row',
        borderBottomColor: '#aaa'
    },
    imageContainer:{
        flex: 1
    },
    inputsContainer:{
        flex: 1.6
    },
    descriptionContainer:{
        flex: 1,
        width: width-40
    },
    imageInput:{
        width: 150,
        height: 150,
        borderRadius: 75
    },
    link:{
        textDecorationLine: 'underline'
    },
    textArea:{
        width: GridWidth(6),
        borderRadius: 10,
        marginBottom: height*0.07
    },
    title:{
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 20
    },
    buttonsContainer:{
        position: 'absolute',
        bottom: 0,
        height: height*0.1,
        width,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    }
});

const mapStateToProps = state=>({
    ColUITheme: state.themesReducer.ColUITheme,
    userData: state.userReducer
});

export default connect(mapStateToProps)(EditProfileInfo);