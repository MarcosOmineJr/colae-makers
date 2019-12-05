import React from 'react';
import { firebase } from '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import { Button, Icon } from 'native-base';
import { connect } from 'react-redux';
import ColaeAPI from '../api';

const { width, height } = Dimensions.get('window');

const { ColUI } = ColaeAPI;

class MyProfileScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            userData: props.user
        }

        this._logOut = this._logOut.bind(this);
        this._fetchFirestore = this._fetchFirestore.bind(this);

        this.authentication = firebase.auth();
        
        this.authentication.onAuthStateChanged(user=>{
            if(!user){
                props.navigation.navigate('Login');
            }
        });
    }

    async _logOut(){
        this.authentication.signOut();
    }

    componentDidMount(){
        this._fetchFirestore();
    }

    componentDidUpdate(){
        this._fetchFirestore();
    }

    async _fetchFirestore(){
        let s = this.state;
        let res = await firebase.firestore().doc(`users/${this.props.user.firebaseRef}`).get();
        s.userData = res.data();
        this.setState(s);
    }

    render(){

        const { user, navigation, ColUITheme } = this.props;
        const { userData } = this.state;

        return (
            <ScrollView contentContainerStyle={styles.container}>
                <ColUI.Card colSpan={6} contentContainerStyle={styles.card}>
                    <View style={styles.userInfoContainer}>
                        <View style={styles.profileImageContainer}>
                            <Image source={{uri: userData.profileimage}} style={styles.profileImage} />
                        </View>
                        <View style={styles.InfoContainer}>
                            <Text style={styles.name}>{ userData.name+' '+userData.lastname }</Text>
                            <Text>{ userData.username }</Text>
                            <Text>de { userData.from.city+' - '+userData.from.state }</Text>
                        </View>
                    </View>
                    <View style={styles.userButtonsContainer}>
                        <Button transparent style={styles.transparentButtonWrapper} onPress={()=>navigation.navigate('Profile', { firebaseRef: user.firebaseRef, collection: 'users' })}>
                            <Text style={[styles.transparentButtonText, { color: ColUITheme.main }]}>Visualizar</Text>
                        </Button>
                        <ColUI.Button label='editar' onPress={()=>navigation.navigate('EditProfile')} />
                    </View>
                </ColUI.Card>
                <TouchableOpacity>
                    { false && <ColUI.Card contentContainerStyle={[styles.card, { padding: 20 }]}>
                        <View style={styles.cardButton}>
                            <Text style={[styles.cardButtonText, { color: ColUITheme.main }]}>Configurações da Conta</Text>
                            <Icon type='MaterialIcons' name='chevron-right' style={[styles.icon, { color: ColUITheme.main }]} />
                        </View>
                    </ColUI.Card>}
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('Help')}>
                    <ColUI.Card contentContainerStyle={[styles.card, { padding: 20 }]}>
                        <View style={styles.cardButton}>
                            <Text style={[styles.cardButtonText, { color: ColUITheme.main }]}>Precisa de Ajuda?</Text>
                            <Icon type='MaterialIcons' name='chevron-right' style={[styles.icon, { color: ColUITheme.main }]} />
                        </View>
                    </ColUI.Card>
                </TouchableOpacity>
                <View style={styles.signOutButtonContainer}>
                    <ColUI.Button colSpan={4} label='sair' onPress={()=>this._logOut()} />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        padding: 20
    },
    card:{
        marginBottom: 20,
        paddingBottom: 20
    },
    userInfoContainer:{
        flexDirection: 'row',
        marginBottom: 20
    },
    profileImageContainer:{
        flex: 2
    },
    profileImage:{
        height: 100,
        width: 100,
        borderRadius: 50
    },
    InfoContainer: {
        flex: 3,
        justifyContent: 'space-between'
    },
    userButtonsContainer:{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    transparentButtonWrapper:{
        width: '45%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 25
    },
    transparentButtonText:{
        fontSize: 16
    },
    name:{
        fontSize: 20,
        fontWeight: 'bold'
    },
    cardButton:{
        height: 40,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    cardButtonText:{
        fontSize: 18
    },
    icon:{
        fontSize: 30
    },
    signOutButtonContainer:{
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

const mapStateToProps = (state)=>{
    return {
        user: state.userReducer,
        ColUITheme: state.themesReducer.ColUITheme
    };
}

export default connect(mapStateToProps)(MyProfileScreen);