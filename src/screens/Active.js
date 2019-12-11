import React from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    TouchableHighlight,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { firebase } from '@react-native-firebase/firestore';
import '@react-native-firebase/auth';
import ColaeAPI from '../api';

const { height, width } = Dimensions.get('window');

const { ColUI } = ColaeAPI;

class Home extends React.Component {

    constructor(props){
        super(props);

        this.state={
            events: [],
            refreshing: false,
            loading: true
        }
        
        this.refreshColors = [
            props.ColUITheme.main,
            props.ColUITheme.accent,
            props.ColUITheme.gray.light,
            props.ColUITheme.purple.light
        ]

        //firebase.auth().signOut();

        this._renderEvents = this._renderEvents.bind(this);
        this._fetchFirebase = this._fetchFirebase.bind(this);
        this._refreshSnapshot = this._refreshSnapshot.bind(this);
    }

    componentDidMount(){

        this._fetchFirebase();

        //Pegando em Realtime, causa muitos problemas em React...
        /*firebase.firestore().collection('events').where('published','==',true).onSnapshot({
            error: (e)=>console.log('Erro:', e),
            next: (QuerySnapshot)=>{
                let data = [];
                QuerySnapshot.docs.map((e, key)=>{
                    data.push({ ...e.data(), key: key.toString(), ref: e.id });
                })
                refreshSnapshot(data);
                console.log(data);
                this.setState({events: data});
            }
        })*/
    }

    async _fetchFirebase(){
        const { refreshSnapshot, userData } = this.props;
        let s = this.state;
        s.loading = true;
        this.setState(s);

        let querySnapshot = await firebase.firestore().collection('events').where('owner','==', userData.firebaseRef).get();
        let data = [];
        querySnapshot.docs.map((doc, key)=>{
            data.push({ ...doc.data(), ref: doc.id });
        });

        let anotherQuery = await firebase.firestore().collection('events').where('producers','array-contains', userData.firebaseRef).get();
        anotherQuery.docs.map((doc, key)=>{
            data.push({ ...doc.data(), ref: doc.id });
        })

        refreshSnapshot(data);

        s.events = data;
        s.loading = false;

        this.setState(s);
    }

    async _refreshSnapshot(){
        let s = this.state;
        s.refreshing = true;
        this.setState(s);

        await this._fetchFirebase();
        s.refreshing = false;
        this.setState(s);
    }

    _renderEvents(event){

        const { navigate } = this.props.navigation;
        const { ColUITheme } = this.props;

        return (
            <TouchableHighlight style={{ marginBottom: 20 }} onPress={()=>navigate('EventInfo', { firebaseRef: event.ref })}>
                <ColUI.Card colSpan={6} contentContainerStyle={[styles.eventCard, { backgroundColor: this.props.ColUITheme.main }]} >
                    <Image source={{uri: event.photos[0]}} style={styles.eventCoverImage} resizeMode='cover' />
                    <View style={styles.eventInfoContainer}>
                        <Text style={styles.eventName} numberOfLines={1}>{event.name}</Text>
                        {event.rating && <ColUI.EventGlobalRating style={styles.rating} rating={event.rating} avaliationCount={event.avaliation_count} />}
                        {!event.rating && <Text style={[styles.rating, { fontSize: 16, color: ColUITheme.background, fontWeight: 'bold' }]}>Novo!</Text>}
                        <Text style={styles.eventDescription} numberOfLines={5}>{event.description}</Text>
                    </View>
                </ColUI.Card>
            </TouchableHighlight>
        );
    }

    render(){

        const { refreshing, events, loading } = this.state;
        const { ColUITheme } = this.props;

        if(loading){
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <ActivityIndicator size='large' color={ColUITheme.main} />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <NavigationEvents onDidFocus={()=>{this.props.setTempDraft(null); this._fetchFirebase()}} />
                <View style={styles.topButtonsContainer} >
                    <ColUI.IconButton label='CRIAR EVENTO' iconName='add' onPress={()=>this.props.navigation.navigate('CreateDraft')} />
                </View>
                <FlatList
                contentContainerStyle={styles.eventCardsContainer}
                data={events}
                renderItem={({item})=>this._renderEvents(item)}
                keyExtractor={item=>item.ref}
                ListEmptyComponent={()=>(<View style={styles.emptyListContainer}><Text>Você não gerencia nenhum evento por enquanto</Text></View>)}
                refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={this._refreshSnapshot} colors={this.refreshColors} /> }
                showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center'
    },
    topButtonsContainer:{
        height: '10%',
        width,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    iconButton:{
        fontSize:30
    },
    headerComponentText:{
        fontSize: 18,
        marginBottom: 20
    },
    eventCardsContainer:{
        alignItems: 'center',
        paddingTop: 10
    },
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
    },
    emptyListContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = (state)=>{
    return {
        ColUITheme: state.themesReducer.ColUITheme,
        events: state.publishedEventsReducer,
        userData: state.userReducer
    };
}

const mapDispatchToProps = (dispatch)=>{
    return {
        refreshSnapshot: (snapshot)=>{dispatch({ type: 'UPDATE_PUBLISHED_SNAPSHOT', payload:snapshot })},
        setTempDraft: (temp)=> dispatch({ type: 'UPDATE_TEMP_DRAFT', payload: temp })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);