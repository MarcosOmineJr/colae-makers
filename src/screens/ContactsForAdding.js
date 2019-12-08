import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {
    StyleSheet,
    Dimensions,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Text
} from 'react-native';
import { Icon } from 'native-base';
import ColaeAPI from '../api';

const { width, height } = Dimensions.get('screen');
const { ColUI } = ColaeAPI;

const ContactsForAdding = (props)=>{

    const { ColUITheme, navigation } = props;
    const [snapshot, setSnapshot] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(()=>{
        if(props.navigation.state.params.selected){
            setSelected(props.navigation.state.params.selected);
        }
    }, []);

    useEffect(()=>{
        async function fetchFirestore(){
            let services = await firestore().collection('services').get();
            services.forEach((r)=>{
                let responseAdd = {...r.data(), ref: r.id}
                setSnapshot(snapshot=>snapshot.concat(responseAdd));
            });
            let producers = await firestore().collection('users').get();
            producers.forEach(r=>{
                let responseAdd = {...r.data(), ref: r.id }
                setSnapshot(snapshot=>snapshot.concat(responseAdd));
            })
        }

        fetchFirestore();
        
    },[]);

    function _handleSelection(userRef){

        if(!selected.includes(userRef)){
            setSelected(selected=>selected.concat(userRef));
        } else {
            let selAsString = selected.toString();
            selAsString = selAsString.replace(userRef, '');

            //Tratamento remoção no meio:
            selAsString = selAsString.replace(',,',',');

            //Reconvertendo para array:
            let selAsArray = selAsString.split(',');

            //Tratamento remoção no início:
            if(selAsArray[0] == ''){
                selAsArray.shift();
            }

            //Tratamento remoção no final:
            if(selAsArray[selAsArray.length-1] == ''){
                selAsArray.pop();
            }

            setSelected(selAsArray);
        }
    }

    return (    
        <View style={{ flex: 1 }}>
            <View style={styles.searchBarContainer}>
                <View style={styles.searchBarContentsContainer}>
                    <Icon type='MaterialIcons' name='search' style={{color: ColUITheme.main}} />
                    <TextInput placeholder='Pesquise por pessoas e eventos' style={[styles.textInput, { color: ColUITheme.purple.light }]} />
                </View>
                <TouchableOpacity style={styles.searchButton} onPress={()=>{}}>
                    <Text style={{ color: ColUITheme.main }}>Pesquisar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>Filtrar</Text>
                    <Icon type='MaterialIcons' name='tune' style={[styles.icon, { color: ColUITheme.main }]} />
                </TouchableOpacity>
                <Text style={[styles.instructions, { color: ColUITheme.gray.light }]}>Selecione da sua lista de contatos as pessoas para adicionar aos eventos</Text>

                {
                    snapshot.map((user, key)=>(
                        <TouchableOpacity key={key.toString()} style={styles.contactCard} onPress={()=>navigation.navigate('Profile', { firebaseRef: user.ref, collection: 'services' })}>
                            <ColUI.UserCardInContacts selected={selected.includes(user.ref)} data={user} onAdd={()=>_handleSelection(user.ref)} />
                        </TouchableOpacity>
                        
                    ))
                }

            </ScrollView>

            <View style={styles.buttonsContainer}>
                <ColUI.Button colSpan={3} label='Confirmar' onPress={()=>props.navigation.navigate('EventServices', { selected: selected })} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    searchBarContainer:{
        paddingHorizontal: 20,
        width,
        height: height*0.1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    searchBarContentsContainer:{
        paddingHorizontal: 10,
        height: 40,
        width: '75%',
        borderWidth: 1.5,
        borderColor: '#ccc',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInput:{
        width: '90%',
        fontSize: 16
    },
    searchButton:{
        width: '20%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container:{
        paddingHorizontal: 20,
        paddingBottom: 10
    },
    filterButton:{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginBottom: 10
    },
    filterText:{
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5
    },
    instructions:{
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 20
    },
    contactCard:{
        marginBottom: 20
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

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme,
    user: state.userReducer
})

export default connect(mapStateToProps)(ContactsForAdding);