import React, {  } from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Dimensions,
    View,
    TouchableOpacity,
    Image,
    Text
} from 'react-native';
import { Icon } from 'native-base';
import Card from './Card';

const { width, height } = Dimensions.get('screen');

const UserCardInContacts = (props)=>{

    const { ColUITheme, data, selected, onAdd } = props;

    return (
        <Card contentContainerStyle={styles.card}>
            <View style={styles.photoContainer}>
                <Image source={{uri: data.profileimage}} style={[styles.profilephoto, { borderColor: ColUITheme.main }]} />
            </View>
            <View style={styles.contentContainer}>
                <View style={[styles.nameContainer, { backgroundColor: ColUITheme.main }]}>
                    <Text style={styles.name} numberOfLines={1}>{`${data.name} ${data.lastname}`}</Text>
                </View>
                <View style={styles.profileType}>
                    { false && data.usertype == 'palestrante' && <Icon type='MaterialIcons' name='add' style={[styles.icon, { color: ColUITheme.main }]} /> }
                    { false && data.usertype == 'ator' && <Icon type='MaterialIcons' name='add' style={[styles.icon, { color: ColUITheme.main }]} /> }
                    <Text numberOfLines={1} style={[styles.userType, { color: ColUITheme.gray.light }]}>{data.usertype}</Text>
                </View>
            </View>
            {!selected &&
                <TouchableOpacity style={styles.buttonContainer} onPress={onAdd}>
                    <Icon type='MaterialIcons' name='add' style={[styles.icon, { color: ColUITheme.main }]} />
                    <Text style={[styles.followButtonText, { color: ColUITheme.main }]}>ADICIONAR</Text>
                </TouchableOpacity>
            }
            {selected &&
                <TouchableOpacity style={styles.buttonContainer} onPress={onAdd}>
                    <Icon type='MaterialIcons' name='check' style={[styles.icon, { fontSize: 30,color: ColUITheme.gray.light }]} />
                    <Text style={[styles.followButtonText, { color: ColUITheme.gray.light }]}>ADICIONADO</Text>
                </TouchableOpacity>
            }
        </Card>
    );
}

UserCardInContacts.defaultProps = {
    selected: false
}

const styles = StyleSheet.create({
    card:{
        flexDirection: 'row',
        padding: 10,
        alignItems: 'flex-start',
        height: height*0.12
    },
    photoContainer:{
        flex: 1
    },
    contentContainer:{
        flex: 1.8,
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
        fontSize: 16,
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
        flex: 1.2,
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
        fontSize: 16
    },
    followButtonText:{
        fontSize: 14
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
})

export default connect(mapStateToProps)(UserCardInContacts);