import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions
} from 'react-native';

import ColaeAPI from '../api';

const { width, height } = Dimensions.get('window');
const { ColUI } = ColaeAPI;

export default class InConstruction extends React.Component {

    render(){
        return (
            <View style={styles.container}>
                <ColUI.Background />
                <Image source={require('../assets/images/undraw_programming_2svr.png')} resizeMethod='scale' resizeMode='contain' style={styles.image} />
                <View style={styles.txtContainer}>
                    <Text style={styles.title}>Aguarde</Text>
                    <Text style={styles.regularTxt}>Essa parte do app está em construção</Text>
                </View>
                <ColUI.Button blue colSpan={5} label='voltar' contentContainerStyle={styles.backBtn} onPress={()=>this.props.navigation.goBack(null)} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    image:{
        width,
        height: width*0.5,
        marginTop: 10
    },
    txtContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: height*0.1
    },
    title:{
        fontSize: 30,
        fontWeight: 'bold',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: height*0.1,
        color: '#ffffff'
    },
    regularTxt:{
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        letterSpacing: 1
    },
    backBtn:{
        marginBottom: height*0.1
    }
});