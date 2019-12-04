import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Dimensions,
    View,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    Text
} from 'react-native';
import { Icon } from 'native-base';
import Card from './Card';
import EventGlobalRating from './EventGlobalRating';

const { height, width } = Dimensions.get('screen');

const UserCard = (props)=>{

    const { ColUITheme, data, navigation, style } = props;
    
    if(data.type == 'user'){
        return (
            <TouchableOpacity onPress={()=>{}} style={style}>
                <Card contentContainerStyle={userCardStyles.card}>
                    <View style={userCardStyles.photoContainer}>
                        <Image source={{uri: data.profilephoto}} style={[userCardStyles.profilephoto, { borderColor: ColUITheme.main }]} />
                    </View>
                    <View style={userCardStyles.contentContainer}>
                        <View style={[userCardStyles.nameContainer, { backgroundColor: ColUITheme.main }]}>
                            <Text style={userCardStyles.name} numberOfLines={1}>{`${data.name} ${data.lastname}`}</Text>
                        </View>
                        <Text style={[userCardStyles.location, { color: ColUITheme.gray.light }]}> {`${data.location.city}, ${data.location.state}`} </Text>
                        <View style={userCardStyles.profileType}>
                            { data.usertype == 'palestrante' && <Icon type='MaterialIcons' name='add' style={[userCardStyles.icon, { color: ColUITheme.main }]} /> }
                            <Text numberOfLines={1} style={[userCardStyles.userType, { color: ColUITheme.gray.light }]}>{data.usertype}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={userCardStyles.buttonContainer}>
                        <Icon type='MaterialIcons' name='add' style={[userCardStyles.icon, { color: ColUITheme.main }]} />
                        <Text style={[userCardStyles.followButtonText, { color: ColUITheme.main }]}>SEGUIR</Text>
                    </TouchableOpacity>
                </Card>
            </TouchableOpacity>
        );
    } else {
        return (
            <TouchableHighlight style={style} onPress={()=>navigation.navigate('EventInfo', { firebaseRef: data.ref })}>
                <Card colSpan={6} contentContainerStyle={[eventCardStyles.eventCard, { backgroundColor: ColUITheme.main }]} >
                    <Image source={{uri: data.photos[0]}} style={eventCardStyles.eventCoverImage} resizeMode='cover' />
                    <View style={eventCardStyles.eventInfoContainer}>
                        <Text style={eventCardStyles.eventName} numberOfLines={1}>{data.name}</Text>
                        <EventGlobalRating style={eventCardStyles.rating} rating={data.rating} avaliationCount={data.avaliation_count} />
                        <Text style={eventCardStyles.eventDescription} numberOfLines={5}>{data.description}</Text>
                    </View>
                </Card>
            </TouchableHighlight>
        );
    }
}

const userCardStyles = StyleSheet.create({
    card:{
        flexDirection: 'row',
        padding: 10,
        alignItems: 'flex-start',
        height: height*0.15
    },
    photoContainer:{
        flex: 1
    },
    contentContainer:{
        flex: 2,
        alignItems: 'flex-start',
        paddingLeft: 15,
        paddingRight: 15
    },
    profilephoto:{
        width: 75,
        height: 75,
        borderRadius: 37.5,
        borderWidth: 1
    },
    nameContainer:{
        padding: 4,
        paddingHorizontal: 8,
        marginBottom: 5
    },
    name:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    location:{
        fontSize: 16,
        marginBottom: 5
    },
    profileType:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonContainer:{
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 15
    },
    icon:{
        fontSize: 35
    },
    userType:{
        fontWeight: 'bold',
        textTransform: 'capitalize',
        fontSize: 18
    },
    followButtonText:{
        fontSize: 16
    }
});

const eventCardStyles = StyleSheet.create({
    eventCard:{
        padding: 0,
        alignItems: 'flex-start',
        flexDirection: 'row',
        height: height*0.22
    },
    eventCoverImage:{
        height: '100%',
        width: '50%',
        borderRadius: 5
    },
    eventInfoContainer:{
        height: '100%',
        width: '50%',
        padding: 10
    },
    eventName:{
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 18,
        marginBottom: 10
    },
    rating:{
        marginBottom: 5
    },
    eventDescription:{
        color: '#ffffff',
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
})

export default connect(mapStateToProps)(UserCard);