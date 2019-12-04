import React from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    ScrollView,
} from 'react-native';
import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;
const { width, height } = Dimensions.get('screen');

const _TEMP_mockData = [{
    user:{
        profilephoto: 'data:image/jpeg;base64,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',
        name: 'Keanu',
        lastname: 'Reeves'
    },
    note: 5,
    message: 'Breathtaking!'
    //message: 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.'
},{
    user:{
        profilephoto: 'https://spinoff.com.br/wp-content/uploads/Jessica-Alba2-1.jpg',
        name: 'Jéssica',
        lastname: 'Alba'
    },
    note: 4.5,
    message: 'Bem daora mano!'
    //message: 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.'
}];

const AvaliationsScreen = (props)=>{
    return (
        <View>
            <ScrollView contentContainerStyle={styles.container}>
            {
                _TEMP_mockData.map((aval, key)=>(
                    <ColUI.AvaliationCard key={key.toString()} avaliation={aval} style={styles.avaliation} />
                ))
            }
            <View style={styles.spacer} />
            </ScrollView>
            <View style={styles.buttonsContainer}>
                <ColUI.Button colSpan={4} label='exportar dados' />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        paddingVertical: 20,
        alignItems: 'center'
    },
    avaliation:{
        marginBottom: 20
    },
    spacer:{
        height: height*0.05
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

export default AvaliationsScreen;