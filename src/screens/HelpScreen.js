import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Dimensions,
    ScrollView,
    View,
    Text,
    ActivityIndicator,
    Linking
} from 'react-native';

const HelpScreen = (props)=>{

    const { ColUITheme } = props;

    const [loading, setLoading] = useState(true);
    const [urls, setUrls] = useState({});

    useEffect(()=>{
        async function fetchFirebase(){
            let urls = await firestore().doc('config/urls').get();
            urls = urls.data();
            setUrls(urls);
            setLoading(false);
        }

        fetchFirebase();
    },[]);

    if(loading){
        return (
            <View style={[styles.container, { flex: 1, justifyContent: 'center' }]}>
                <ActivityIndicator size='large' color={ColUITheme.main} />
            </View>
        );
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={[styles.title, { color: ColUITheme.main }]}>Mas afinal, o que é o Colaê?</Text>
            <Text style={[styles.text, { color: ColUITheme.gray.light }]}><Text style={[styles.link, { color: ColUITheme.main }]} onPress={()=>{Linking.openURL(urls.youtube)}}>Assista nosso vídeo conceitual</Text> para entender um pouco melhor o nosso projeto.</Text>
            <Text style={[styles.text, { color: ColUITheme.gray.light, alignSelf: 'flex-start', marginTop: 20, marginBottom: 50 }]}>Dê uma olhada também no <Text style={[styles.link, { color: ColUITheme.main }]} onPress={()=>{Linking.openURL(urls.site)}}>nosso site</Text></Text>
            <Text style={[styles.title, { color: ColUITheme.main, marginBottom: 0 }]}>Cláusula de Reserva</Text>
            <Text style={[styles.text, { color: ColUITheme.gray.light, alignSelf: 'flex-start', marginTop: 20, marginBottom: 45 }]}>
                <Text style={styles.link}>CLÁUSULA DE RESERVA (Lei 9.610/98 - LEI DE DIREITOS AUTORAIS):</Text> Este app foi publicado e é mantido pelos discentes do 8° semestre, do Curso de Graduação em Design Digital, da Universidade Anhembi Morumbi, visando a atender às exigências do Projeto Final em Design Digital. Trata-se de uma publicação temporária para propósitos estritamente acadêmicos e sem fins lucrativos. Em atendimento às exigências da Lei 9.610/98, do parágrafo 4°, do Artigo 184, do Código Penal, os discentes responsáveis por esta publicação colocam-se à disposição, por intermédio do e-mail <Text style={[styles.link, { color: ColUITheme.main }]} onPress={()=>{Linking.openURL('mailto:suporte@colaeapp.com')}}>suporte@colaeapp.com</Text>, para dirimir quaisquer dúvidas referentes à eventual violação de direitos autorais, comprometendo-se desde já, remover dos servidores online, qualquer texto, som ou imagem pertencente a autor ou titular que se sinta direta ou indiretamente prejudicado.
            </Text>
            <Text style={[styles.text, { color: ColUITheme.gray.light }]}>Ainda precisa de ajuda? <Text style={[styles.link, { color: ColUITheme.main }]} onPress={()=>{Linking.openURL('mailto:suporte@colaeapp.com')}}>suporte@colaeapp.com</Text></Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        padding: 20
    },
    title:{
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20
    },
    text:{
        fontSize: 16
    },
    link:{
        textDecorationLine: 'underline'
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
});

export default connect(mapStateToProps)(HelpScreen);