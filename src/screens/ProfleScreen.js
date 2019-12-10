import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { shadow } from '../api/components/styles';
import ColaeAPI from '../api';
import Cantor from '../assets/icons/cantor.svg';
import DJ from '../assets/icons/DJ.svg';
import Palestrante from '../assets/icons/palestrante.svg';
import Promotor from '../assets/icons/promotor.svg';
import Servico from '../assets/icons/servico.svg';
import {
    StyleSheet,
    Dimensions,
    ScrollView,
    View,
    ActivityIndicator,
    Text,
    Image,
    Linking
} from 'react-native';
import { Icon } from 'native-base';

const { ColUI } = ColaeAPI;
const { width, height } = Dimensions.get('screen');

const ProfileScreen = (props)=>{

    const { navigation, ColUITheme, user } = props;

    const { firebaseRef, collection } = navigation.state.params;

    const [loading, setLoading] = useState(true);
    const [snapshot, setSnapshot] = useState({});

    useEffect(()=>{
        async function fetchFirebase(){
            
            //Pronto! Agora ele abre o perfil independentemente de em que coleção o usuário está...
            let response = await firestore().collection('users').doc(firebaseRef).get();
            if(response.exists){
                setSnapshot({...response.data(), firebaseRef: response.id });
                setLoading(false);
            } else {
                response = await firestore().collection('services').doc(firebaseRef).get();
                setSnapshot({...response.data(), firebaseRef: response.id });
                setLoading(false);
            }
            
            /*
            let response = await firestore().doc(collection+'/'+firebaseRef).get();
            setSnapshot(response.data());
            setLoading(false);
            */
        }

        fetchFirebase();
    },[]);

    if(loading){
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={ColUITheme.main} />
            </View>
        );
    };

    const formatPhone = (phone)=>{
        let phoneNumber = phone.substr(4, 9);
        let firstPart = phoneNumber.substr(0, 5);
        let lastPart = phoneNumber.substr(5, 4);
        let ddd = phone.substr(2, 2);
        return `(${ddd}) ${firstPart}-${lastPart}`;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={[styles.basicInfoContainer, snapshot.firebaseRef != user.firebaseRef ? {} : { flex:0.8 }]}>
                <View style={styles.basicInfoWrapper}>
                    <View style={styles.left}>
                        <View style={styles.imageWrapper}>
                            {user.profileimage != undefined && <Image source={{uri: snapshot.profileimage}} style={[styles.profilephoto, { borderColor: ColUITheme.main }]} />}
                            {user.profileimage == undefined && <View />}
                        </View>
                        <View style={styles.userTypeWrapper}>
                            { snapshot.usertype == 'cantor' && <Cantor width={30} height={30} style={styles.icon} />}
                            { snapshot.usertype == 'dj' && <DJ width={30} height={30} style={styles.icon} />}
                            { snapshot.usertype == 'palestrante' && <Palestrante width={30} height={30} style={styles.icon} />}
                            { snapshot.usertype == 'promoter' && <Promotor width={30} height={30} style={styles.icon} />}
                            { snapshot.usertype == 'servico' && <Servico width={30} height={30} style={styles.icon} />}
                            <Text numberOfLines={1} style={[styles.userType, { color: ColUITheme.gray.light }]}>{snapshot.usertype}</Text>
                        </View>
                    </View>
                    <View style={styles.right}>
                        <View style={[styles.nameContainer, { backgroundColor: ColUITheme.main }]}>
                            { snapshot.lastname != '' && <Text style={styles.name}>{`${snapshot.name} ${snapshot.lastname}`}</Text>}
                            { snapshot.lastname == '' && <Text style={styles.name}>{`${snapshot.name}`}</Text>}
                        </View>
                        { snapshot.username && <Text style={styles.username}>{`${snapshot.username}`}</Text> }
                        <Text style={styles.location}> {`${snapshot.from.city}, ${snapshot.from.state}`} </Text>
                        {
                            snapshot.usertype != 'público' &&
                            <View style={styles.contactsWrapper}>
                                <Text style={styles.location}>Contato:</Text>
                                <Text style={[styles.email, { color: ColUITheme.main }]} onPress={()=>{Linking.openURL(`tel:${snapshot.phone}`)}}> {formatPhone(`${snapshot.phone}`)} </Text>
                                <Text style={[styles.email, { color: ColUITheme.main }]} onPress={()=>{Linking.openURL(`mailto:${snapshot.email}`)}}> {`${snapshot.email}`} </Text>
                            </View>
                        }
                        {
                            snapshot.usertype == 'público' &&
                            <View style={styles.followingAndFollowersWrapper}>
                                <View style={[styles.followingWrapper, { borderRightColor: ColUITheme.main }]}>
                                    <Text style={[styles.followSectionTitle, { color: ColUITheme.gray.light }]}>Seguindo</Text>
                                    <Text style={[styles.followtitle, { color: ColUITheme.main }]}>43</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={[styles.followSectionTitle, { color: ColUITheme.gray.light }]}>Seguidores</Text>
                                    <Text style={[styles.followtitle, { color: ColUITheme.main }]}>2</Text>
                                </View>
                            </View>
                        }
                    </View>
                </View>
                {snapshot.firebaseRef != user.firebaseRef &&
                    <View style={styles.buttonsContainer}>
                        <ColUI.Button label='seguir' onPress={()=>{}} />
                        {snapshot.whatsapp != '' && <ColUI.Button blue label='enviar mensagem' onPress={()=>Linking.openURL('https://wa.me/'+snapshot.whatsapp)} />}
                    </View>
                }
            </View>
            <View style={styles.otherInfos}>
                <Text style={[styles.title, { color: ColUITheme.gray.light }]}>Sobre</Text>
                { snapshot.about == '' && <Text style={[styles.about, { color: ColUITheme.gray.light }]}>{`${snapshot.name} ainda não adicionou nenhuma descrição`}</Text>}
                { snapshot.about == undefined && <Text style={[styles.about, { color: ColUITheme.gray.light }]}>{`${snapshot.name} ainda não adicionou nenhuma descrição`}</Text>}
                { snapshot.about != '' && snapshot.about != undefined && <Text style={[styles.about, { color: ColUITheme.gray.light }]}>{`${snapshot.about}`}</Text>}
                <Text style={[styles.title, { color: ColUITheme.gray.light }]}>Eventos em que já participou</Text>
                {
                    snapshot.participatedin && snapshot.participatedin[0] != '' &&
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.eventImageCardsContainer}>
                        {
                            snapshot.participatedin.map((reference, key)=>(
                                <ColUI.EventImageCardWhy key={key.toString()} style={styles.eventImageCard} firebaseRef={reference} onPress={()=>navigation.navigate('EventInfo', { firebaseRef:reference })} />
                            ))
                        }
                    </ScrollView>
                }
                { snapshot.participatedin && snapshot.participatedin[0] == '' && <Text>{`${snapshot.name} ainda não participou de nenhum evento`}</Text> }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container:{
        flex: 1,
        alignItems: 'center'
    },
    basicInfoContainer:{
        ...shadow,
        padding: 20,
        width,
        flex: 1,
        backgroundColor: '#ffffff'
    },
    basicInfoWrapper:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingTop: 15
    },
    left:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profilephoto:{
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 1
    },
    imageWrapper:{
        marginBottom: 20
    },
    userTypeWrapper:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 15
    },
    icon:{
        marginRight: '5%'
    },
    userType:{
        fontWeight: 'bold',
        textTransform: 'capitalize',
        fontSize: 16
    },
    right:{
        flex: 1,
        height: '100%',
        alignItems: 'flex-start'
    },
    nameContainer:{
        padding: 4,
        paddingHorizontal: 8,
        marginBottom: 5
    },
    name:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    username:{
        color: '#aaa',
        marginBottom: 5
    },
    location:{
        fontWeight: 'bold'
    },
    contactsWrapper:{
        justifyContent: 'flex-end',
        paddingTop: '10%'
    },
    email:{
        textDecorationLine: 'underline',
        marginTop: 3
    },
    followingAndFollowersWrapper:{
        flexDirection: 'row',
        paddingTop: 20
    },
    followingWrapper:{
        flex: 1,
        alignItems: 'center',
        borderRightWidth: 1
    },
    followSectionTitle:{
        fontWeight: 'bold',
        marginBottom: 10
    },
    followtitle:{
        fontSize: 18,
        fontWeight: 'bold'
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
    otherInfos:{
        flex: 1.5,
        width,
        padding: 20
    },
    title:{
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    about:{
        marginBottom: 50
    },
    eventImageCard:{
        marginVertical: 10,
        marginRight: 10
    },
    eventImageCardsContainer:{
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme,
    user: state.userReducer
})

export default connect(mapStateToProps)(ProfileScreen);