import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import ColaeAPI from '../api';

export default class AuthCheck extends React.Component {

    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Home</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text:{
        fontSize: 30,
        marginBottom: 20
    }
});