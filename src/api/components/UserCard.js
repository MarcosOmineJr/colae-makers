import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Cantor from '../../assets/icons/cantor.svg';
import DJ from '../../assets/icons/DJ.svg';
import Palestrante from '../../assets/icons/palestrante.svg';
import Promotor from '../../assets/icons/promotor.svg';
import Servico from '../../assets/icons/servico.svg';
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

    const { ColUITheme, data, navigation, style, onPress, user } = props;
    
    if(data.type == 'user'){
        return (
            <TouchableOpacity onPress={()=>navigation.navigate('ProfileStack', { firebaseRef: data.ref, collection: 'users' })} style={style}>
                <Card contentContainerStyle={userCardStyles.card}>
                    <View style={userCardStyles.photoContainer}>
                        <Image source={{uri: data.profileimage}} style={[userCardStyles.profilephoto, { borderColor: ColUITheme.main }]} />
                    </View>
                    <View style={userCardStyles.contentContainer}>
                        <View style={[userCardStyles.nameContainer, { backgroundColor: ColUITheme.main }]}>
                            <Text style={userCardStyles.name} numberOfLines={1}>{`${data.name} ${data.lastname}`}</Text>
                        </View>
                        <Text style={[userCardStyles.location, { color: ColUITheme.gray.light }]}> {`${data.from.city}, ${data.from.state}`} </Text>
                        <View style={userCardStyles.profileType}>
                            { data.usertype == 'cantor' && <Cantor width={30} height={30} style={userCardStyles.icon} />}
                            { data.usertype == 'dj' && <DJ width={30} height={30} style={userCardStyles.icon} />}
                            { data.usertype == 'palestrante' && <Palestrante width={30} height={30} style={userCardStyles.icon} />}
                            { data.usertype == 'promoter' && <Promotor width={30} height={30} style={userCardStyles.icon} />}
                            { data.usertype == 'servico' && <Servico width={30} height={30} style={userCardStyles.icon} />}
                            <Text numberOfLines={1} style={[userCardStyles.userType, { color: ColUITheme.gray.light }]}>{data.usertype}</Text>
                        </View>
                    </View>
                    {data.firebaseRef != user.firebaseRef &&
                        <TouchableOpacity style={userCardStyles.buttonContainer}>
                            <Icon type='MaterialIcons' name='add' style={[userCardStyles.icon, { color: ColUITheme.main }]} />
                            <Text style={[userCardStyles.followButtonText, { color: ColUITheme.main }]}>SEGUIR</Text>
                        </TouchableOpacity>
                    }
                    {data.firebaseRef == user.firebaseRef &&
                        <View style={userCardStyles.buttonContainer} />
                    }
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
        marginRight: 10
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
    ColUITheme: state.themesReducer.ColUITheme,
    user: state.userReducer
})

export default connect(mapStateToProps)(UserCard);