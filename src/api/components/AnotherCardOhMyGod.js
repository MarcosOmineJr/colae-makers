import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Cantor from '../../assets/icons/cantor.svg';
import DJ from '../../assets/icons/DJ.svg';
import Palestrante from '../../assets/icons/palestrante.svg';
import Promotor from '../../assets/icons/promotor.svg';
import Servico from '../../assets/icons/servico.svg';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { Icon } from 'native-base';

const AnotherCardOhMyGod = props => {

    const { ColUITheme, contentContainerStyle, onRemove } = props;

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});

    useEffect(()=>{
        async function fetchFirebase(){
            const { firebaseRef } = props;

            try{
                let response = await firestore().collection('services').doc(firebaseRef).get();
                if(response.exists){
                    setUser(response.data());
                    setLoading(false);
                } else {
                    response = await firestore().collection('users').doc(firebaseRef).get();
                    setUser(response.data());
                    setLoading(false);
                }
            } catch(e){
                console.log('Erro: ', e);
            }
        }
        fetchFirebase();
    },[]);

    if(loading){
        return <View />
    }
    return (
        <View style={[styles.card, { borderColor: ColUITheme.main }, contentContainerStyle]}>
            { user.usertype == 'cantor' && <Cantor width={30} height={30} style={styles.typeIcon} />}
            { user.usertype == 'dj' && <DJ width={30} height={30} style={styles.typeIcon} />}
            { user.usertype == 'palestrante' && <Palestrante width={30} height={30} style={styles.typeIcon} />}
            { user.usertype == 'promoter' && <Promotor width={30} height={30} style={styles.typeIcon} />}
            { user.usertype == 'servico' && <Servico width={30} height={30} style={styles.typeIcon} />}
            <Text numberOfLines={1} style={[styles.cardText, { color: ColUITheme.gray.light }]}>{`${user.name} ${user.lastname}`}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onRemove} >
                <Icon type='MaterialIcons' name='close' style={[styles.closeIcon, { color: ColUITheme.gray.light }]} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card:{
        flexDirection: 'row',
        padding: 10,
        paddingHorizontal: 15,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    typeIcon:{
        marginRight: 5
    },
    cardText:{
        fontWeight: 'bold',
        fontSize: 16,
        marginHorizontal: 10
    },
    closeButton:{
        height: 25,
        width: 25,
        alignItems:'center',
        justifyContent: 'center'
    },
    closeIcon:{
        fontSize: 20
    }
});

const mapStateToProps = state => ({
    ColUITheme: state.themesReducer.ColUITheme
});

export default connect(mapStateToProps)(AnotherCardOhMyGod);