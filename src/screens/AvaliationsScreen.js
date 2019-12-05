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
        name: 'Eduardo',
        lastname: 'Souza'
    },
    note: 5,
    message: 'Achei muito interessante!'
    //message: 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker.'
},{
    user:{
        profilephoto: 'https://i0.wp.com/metro.co.uk/wp-content/uploads/2019/10/PRI_90095071.jpg?quality=90&strip=all&zoom=1&resize=644%2C483&ssl=1',
        name: 'Olívia',
        lastname: 'Matoszko'
    },
    note: 4.5,
    message: 'Estava muito bom, mas o lugar é muito escuro.'
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