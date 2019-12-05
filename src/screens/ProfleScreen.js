import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { shadow } from '../api/components/styles';
import ColaeAPI from '../api';
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

    const { navigation, ColUITheme } = props;

    const { firebaseRef, collection } = navigation.state.params;

    const [loading, setLoading] = useState(true);
    const [snapshot, setSnapshot] = useState({});

    useEffect(()=>{
        async function fetchFirebase(){
            let response = await firestore().doc(collection+'/'+firebaseRef).get();
            setSnapshot(response.data());
            setLoading(false);
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
            <View style={styles.basicInfoContainer}>
                <View style={styles.basicInfoWrapper}>
                    <View style={styles.left}>
                        <View style={styles.imageWrapper}>
                            <Image source={{uri: snapshot.profileimage}} style={[styles.profilephoto, { borderColor: ColUITheme.main }]} />
                        </View>
                        <View style={styles.userTypeWrapper}>
                            { snapshot.usertype == 'palestrante' && <Icon type='MaterialIcons' name='add' style={[styles.icon, { color: ColUITheme.main }]} /> }
                            { snapshot.usertype == 'ator' && <Icon type='MaterialIcons' name='add' style={[styles.icon, { color: ColUITheme.main }]} /> }
                            <Text numberOfLines={1} style={[styles.userType, { color: ColUITheme.gray.light }]}>{snapshot.usertype}</Text>
                        </View>
                    </View>
                    <View style={styles.right}>
                        <View style={[styles.nameContainer, { backgroundColor: ColUITheme.main }]}>
                            { snapshot.lastname != '' && <Text style={styles.name}>{`${snapshot.name} ${snapshot.lastname}`}</Text>}
                            { snapshot.lastname == '' && <Text style={styles.name}>{`${snapshot.name}`}</Text>}
                        </View>
                        { snapshot.username && <Text style={styles.username}>{`${snapshot.username}`}</Text> }
                        <Text style={styles.location}> {`${snapshot.location.city}, ${snapshot.location.state}`} </Text>
                        <View style={styles.contactsWrapper}>
                            <Text style={styles.location}>Contato:</Text>
                            <Text style={[styles.email, { color: ColUITheme.main }]} onPress={()=>{Linking.openURL(`tel:${snapshot.phone}`)}}> {formatPhone(`${snapshot.phone}`)} </Text>
                            <Text style={[styles.email, { color: ColUITheme.main }]} onPress={()=>{Linking.openURL(`mailto:${snapshot.email}`)}}> {`${snapshot.email}`} </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.buttonsContainer}>
                    <ColUI.Button label='seguir' onPress={()=>{}} />
                    {snapshot.whatsapp != '' && <ColUI.Button blue label='enviar mensagem' onPress={()=>Linking.openURL('https://wa.me/'+snapshot.whatsapp)} />}
                </View>
            </View>
            <View style={styles.otherInfos}>
                <Text style={[styles.title, { color: ColUITheme.gray.light }]}>Sobre</Text>
                <Text style={[styles.about, { color: ColUITheme.gray.light }]}> {`${snapshot.about}`} </Text>
                <Text style={[styles.title, { color: ColUITheme.gray.light }]}>Eventos em que já participou</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.eventImageCardsContainer}>
                    {
                        snapshot.participatedin.map((reference, key)=>(
                            <ColUI.EventImageCardWhy key={key.toString()} style={styles.eventImageCard} firebaseRef={reference} onPress={()=>navigation.navigate('EventInfo', { firebaseRef:reference })} />
                        ))
                    }
                </ScrollView>
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
        fontSize: 35
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
        position: 'absolute',
        bottom: 0
    },
    email:{
        textDecorationLine: 'underline',
        marginTop: 10
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
    ColUITheme: state.themesReducer.ColUITheme
})

export default connect(mapStateToProps)(ProfileScreen);