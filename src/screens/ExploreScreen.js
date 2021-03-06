import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView
} from 'react-native';
import {
    Icon
} from 'native-base';
import ColaeAPI from '../api';
import { shadow } from '../api/components/styles';

const { height, width } = Dimensions.get('screen');
const { ColUI } = ColaeAPI;

const _TEMP_mockData = [{
    type: 'user',
    profilephoto: 'https://spinoff.com.br/wp-content/uploads/Jessica-Alba2-1.jpg',
    name: 'Jéssica',
    lastname: 'Alba',
    location:{
        city: 'São Paulo',
        state: 'SP'
    },
    usertype: 'palestrante'
},{
    type: 'user',
    profilephoto: 'https://spinoff.com.br/wp-content/uploads/Jessica-Alba2-1.jpg',
    name: 'Jéssica',
    lastname: 'Alba',
    location:{
        city: 'São Paulo',
        state: 'SP'
    },
    usertype: 'palestrante'
},{
    type: 'event',
    ref: '33ewvdvs',
    photos: ['https://spinoff.com.br/wp-content/uploads/Jessica-Alba2-1.jpg'],
    name: 'Evento Teste',
    rating: 5,
    avaliation_count: 1000,
    description: 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.'
},{
    type: 'event',
    ref: '33ewvdvs',
    photos: ['https://spinoff.com.br/wp-content/uploads/Jessica-Alba2-1.jpg'],
    name: 'Evento Teste',
    rating: 5,
    avaliation_count: 1000,
    description: 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.'
}]

const ExploreScreen = (props)=>{
    const [showResults, setShowResult] = useState(false);
    const [results, setResults] = useState({});
    const { ColUITheme, navigation } = props;

    const fetchFirestore = async()=>{
        let searchResult = [];
        let promoters = await firestore().collection('users').where('usertype','==','promoter').get();
        promoters.docs.map((promoter,key)=>{
            searchResult.push({...promoter.data(), key: key, type: 'user', ref: promoter.id });
        });
        let events = await firestore().collection('events').where('published', '==', true).get();
        events.docs.map((event, key)=>{
            searchResult.push({...event.data(), key: key, type: 'event', ref:event.id });
        })
        
        setResults(searchResult);
        setShowResult(true);
    }

    return (
        <View style={styles.container} >
            <View style={styles.searchBarContainer}>
                <View style={styles.searchBarContentsContainer}>
                    <Icon type='MaterialIcons' name='search' style={{color: ColUITheme.main}} />
                    <TextInput placeholder='Pesquise por pessoas e eventos' style={[styles.textInput, { color: ColUITheme.purple.light }]} />
                </View>
                <TouchableOpacity style={styles.searchButton} onPress={()=>{fetchFirestore()}}>
                    <Text style={{ color: ColUITheme.main }}>Pesquisar</Text>
                </TouchableOpacity>
            </View>
            
            {/* Resultados de Pesquisa */}
            { showResults &&
                <ScrollView contentContainerStyle={styles.resultsContainer}>
                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterText}>Filtrar</Text>
                        <Icon type='MaterialIcons' name='tune' style={[styles.icon, { color: ColUITheme.main }]} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Encontre pessoas, eventos, locais e serviços</Text>
                    {results.map((res, key)=>(
                        <ColUI.UserCard key={key.toString()} navigation={navigation} data={res} style={styles.resultCard} />
                    ))}
                </ScrollView>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    searchBarContainer:{
        ...shadow,
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
    resultsContainer:{
        padding: 20,
        alignItems: 'center'
    },
    title:{
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 16,
        marginBottom: 20
    },
    resultCard:{
        marginBottom: 20
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
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
})

export default connect(mapStateToProps)(ExploreScreen);