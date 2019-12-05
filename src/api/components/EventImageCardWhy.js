import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {
    StyleSheet,
    TouchableHighlight,
    View,
    Image,
    ActivityIndicator
} from 'react-native';

const EventImageCardWhy = (props)=>{

    const [loading, setLoading] = useState(true);
    const [snapshot, setSnapshot] = useState({});
    const { firebaseRef, onPress, style, ColUITheme } = props;

    useEffect(()=>{

        async function fetchFirebase(){
            let response = await firestore().doc('events/'+firebaseRef).get();
            setSnapshot(response.data());
            setLoading(false);
        }

        fetchFirebase();
    },[]);

    if(loading){
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color={ColUITheme.main} />
            </View>
        )
    }
    return (
        <TouchableHighlight style={[styles.container, style]} onPress={onPress}>
            <Image source={{uri: snapshot.photos[0]}} style={styles.imageCard} />
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    container:{
        height: 120,
        width: 120,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageCard: {
        height: 120,
        width: 120,
        borderRadius: 10
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
});

export default connect(mapStateToProps)(EventImageCardWhy);