import React from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text
} from 'react-native';

const AvaliationsScreen = (props)=>{
    return (
        <View style={styles.container}>
            <Text style={styles.test}>Eae</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    test:{
        fontSize: 40,
        fontWeight: 'bold'
    }
});

export default AvaliationsScreen;