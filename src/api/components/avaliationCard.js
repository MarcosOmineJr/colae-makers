import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native';
import Card from './Card';
import EventGlobalRating from './EventGlobalRating';

const AvaliationCard = (props)=>{

    const { ColUITheme, avaliation, style } = props;

    return (
        <Card colSpan={6} contentContainerStyle={[styles.container, style]}>
            <View style={styles.photoContainer}>
                <Image source={{uri: avaliation.user.profilephoto}} style={styles.profilephoto} />
            </View>
            <View style={styles.contentContainer}>
                <View style={[styles.nameContainer, { backgroundColor: ColUITheme.main }]}>
                    <Text style={styles.name} numberOfLines={1}>{`${avaliation.user.name} ${avaliation.user.lastname}`}</Text>
                </View>
                <EventGlobalRating rating={avaliation.note} lightContent={false} showTotalCount={false} style={styles.rating} />
                <Text style={styles.message}>{avaliation.message}</Text>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    container:{
        padding: 15,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    photoContainer:{
        flex: 1
    },
    contentContainer:{
        flex: 4,
        alignItems: 'flex-start',
        paddingLeft: 10,
        paddingRight: 15
    },
    profilephoto:{
        width: 60,
        height: 60,
        borderRadius: 30
    },
    nameContainer:{
        padding: 4,
        paddingHorizontal: 8
    },
    name:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    rating:{
        marginVertical: 10
    },
    message:{
        fontSize: 16
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
})

export default connect(mapStateToProps)(AvaliationCard);