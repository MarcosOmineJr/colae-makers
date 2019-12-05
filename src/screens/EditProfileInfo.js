import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ColaeAPI from '../api';
import ImagePicker from 'react-native-image-crop-picker';
import { Button, Textarea } from 'native-base';
import {
    StyleSheet,
    Dimensions,
    ScrollView,
    View,
    Text,
    Modal,
    ActivityIndicator
} from 'react-native';

const { width, height } = Dimensions.get('screen');
const { ColUI } = ColaeAPI;

const GridWidth = (colSpan)=>((width*0.1027)*colSpan)+((width*0.055)*(colSpan-1));

const EditProfileInfo = props=>{

    const { ColUITheme, userData, navigation, setUserData } = props;

    const [profileimage, setProfileimage] = useState({path: userData.profileimage});
    const [basicInfo, setBasicInfo] = useState(userData);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const ImageInputHandler = async ()=>{
        try{
            let image = await ImagePicker.openPicker({
                width: 400,
                height: 400,
                cropping: true
            });

            setProfileimage(image);

            /*if(profileimage.mime == '' || profileimage.mime == undefined || profileimage.mime == null){
                setProfileimage({ path: basicInfo.profileimage })
            }*/

        } catch(e){
            console.log('Erro: ', e.message);
        }
    }

    const textInputHandler = (input, field)=>{
        switch(field){
            case 'name':
                setBasicInfo({...basicInfo, name:input });
                break;
            case 'lastname':
                setBasicInfo({...basicInfo, lastname:input });
                break;
            case 'username':
                setBasicInfo({...basicInfo, username: input});
                break;
            case 'state':
                setBasicInfo({...basicInfo, from:{ ...from, state: input }  });
                break;
            case 'city':
                setBasicInfo({...basicInfo, from:{ ...from, city: input }  });
                break;
            case 'about':
                setBasicInfo({...basicInfo, about: input  });
                break;
        }
        console.log(basicInfo);
    }

    function handleUpdate(){
        if(profileimage.path != '' && basicInfo.name != '' && basicInfo.lastname != '' && basicInfo.lastname != '' && basicInfo.from.state != '' && basicInfo.from.city != '' ){
            if(profileimage.mime != undefined){
                setLoading(true);
                setVisible(true);
                let imagePath = profileimage.path.replace('file://','');
                storage().ref(`profileimages/${basicInfo.firebaseRef}/profileimage`).putFile(imagePath).on(storage.TaskEvent.STATE_CHANGED, snapshot=>{
                    if(snapshot.state === storage.TaskState.SUCCESS){
                        storage().ref(`profileimages/${basicInfo.firebaseRef}/profileimage`).getDownloadURL()
                            .then(url=>{
                                firestore().doc(`users/${basicInfo.firebaseRef}`).set({ ...basicInfo, profileimage:url });
                                setUserData({ ...basicInfo, profileimage:url });
                                setLoading(false);
                            }).catch((e)=>{
                                console.log('Erro: ', e.message);
                            })
                    }
                },error=>{
                    console.log('Erro: ', error.message);
                })
            } else {
                setLoading(true);
                setVisible(true);
                firestore().doc(`users/${basicInfo.firebaseRef}`).set(basicInfo);
                setUserData(basicInfo);
                setLoading(false);
            }
            
        }
    }

    return (
        <View>
            <Modal animationType='fade' visible={visible} transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modal, { backgroundColor: ColUITheme.background }]}>
                        {loading && <ActivityIndicator size='large' color={ColUITheme.main} />}
                        {!loading && <Text style={[styles.modalText, { color: ColUITheme.main }]}>Suas informações foram atualizadas!</Text>}
                        <View style={styles.buttonsContainer}>
                            <ColUI.Button blue label='voltar' onPress={()=>setVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.basicInfoContainer}>
                    <View style={styles.imageContainer}>
                        <ColUI.ProfileImageInput edit source={profileimage.mime ? {uri: profileimage.path} : {uri: userData.profileimage}} onPress={ImageInputHandler} />
                    </View>
                    <View style={styles.inputsContainer}>
                        <ColUI.TextInput colSpan={3.8}label='Nome' value={`${basicInfo.name}`} onChangeText={(t)=>textInputHandler(t, 'name')} />
                        <ColUI.TextInput colSpan={3.8}label='Sobrenome' value={`${basicInfo.lastname}`} onChangeText={(t)=>textInputHandler(t, 'lastname')} />
                        <ColUI.TextInput colSpan={3.8}label='@nome_de_usuario' value={`${basicInfo.username}`} onChangeText={(t)=>textInputHandler(t, 'username')} />
                        <ColUI.TextInput colSpan={3.8}label='Estado' value={`${basicInfo.from.state}`} onChangeText={(t)=>textInputHandler(t, 'state')} />
                        <ColUI.TextInput colSpan={3.8}label='Cidade' value={`${basicInfo.from.city}`} onChangeText={(t)=>textInputHandler(t, 'city')} />
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
                    placeholder={basicInfo.about ? '' : 'Fale um pouco sobre você'}
                    style={[styles.textArea, { borderColor: ColUITheme.main }]}
                    onChangeText={(t)=>textInputHandler(t, 'about')}
                    value={basicInfo.about ? basicInfo.about : ''}
                    />
                </View>
            </ScrollView>
            <View style={styles.buttonsContainer}>
                <ColUI.Button label='confirmar' onPress={handleUpdate} />
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
    },
    modalContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modal:{
        height: height*0.3,
        width: width*0.8,
        elevation: 5,
        borderRadius: 10,
        alignItems: 'center',
        padding: 20,
        paddingTop: 50
    },
    modalText:{
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

const mapStateToProps = state=>({
    ColUITheme: state.themesReducer.ColUITheme,
    userData: state.userReducer
});

const mapDispatchToProps = (dispatch)=>({
    setUserData: (data)=>dispatch({ type: 'SET_USER_INFO', payload:data })
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileInfo);