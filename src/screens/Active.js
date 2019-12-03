import React from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    TouchableHighlight,
    RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { firebase } from '@react-native-firebase/firestore';
import ColaeAPI from '../api';

const { height, width } = Dimensions.get('window');

const { ColUI } = ColaeAPI;

class Home extends React.Component {

    constructor(props){
        super(props);

        this.state={
            events: [],
            refreshing: false
        }
        
        this.refreshColors = [
            props.ColUITheme.main,
            props.ColUITheme.accent,
            props.ColUITheme.gray.light,
            props.ColUITheme.purple.light
        ]

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
        const { refreshSnapshot } = this.props;
        let s = this.state;

        let querySnapshot = await firebase.firestore().collection('events').where('published', '==', true).get();
        let data = [];
        querySnapshot.docs.map((doc, key)=>{
            data.push({ ...doc.data(), key: key.toString(), ref: doc.id });
        });
        refreshSnapshot(data);

        s.events = data;

        this.setState(s);
    }

    async _refreshSnapshot(){
        let s = this.state;
        s.refreshing = true;
        this.setState(s);

        await this._fetchFirebase();
        s.refreshing = false;
        console.log(s);
        this.setState(s);
    }

    _renderEvents(event){

        const { navigate } = this.props.navigation;

        return (
            <TouchableHighlight style={{ marginBottom: 20 }} onPress={()=>navigate('EventInfo', { firebaseRef: event.ref })}>
                <ColUI.Card colSpan={6} contentContainerStyle={[styles.eventCard, { backgroundColor: this.props.ColUITheme.main }]} >
                    <Image source={{uri: event.photos[0]}} style={styles.eventCoverImage} resizeMode='cover' />
                    <View style={styles.eventInfoContainer}>
                        <Text style={styles.eventName} numberOfLines={1}>{event.name}</Text>
                        <ColUI.EventGlobalRating style={styles.rating} rating={event.rating} avaliationCount={event.avaliation_count} />
                        <Text style={styles.eventDescription} numberOfLines={5}>{event.description}</Text>
                    </View>
                </ColUI.Card>
            </TouchableHighlight>
        );
    }

    render(){

        const { refreshing, events } = this.state;

        return (
            <View style={styles.container}>
                <NavigationEvents onDidFocus={()=>this.props.setTempDraft(null)} />
                <View style={styles.topButtonsContainer} >
                    <ColUI.IconButton label='CRIAR EVENTO' iconName='add' onPress={()=>this.props.navigation.navigate('CreateDraft')} />
                </View>
                <FlatList
                contentContainerStyle={styles.eventCardsContainer}
                data={events}
                renderItem={({item})=>this._renderEvents(item)}
                ListEmptyComponent={()=>(<View style={styles.emptyListContainer}><Text>Você não gerencia nenhum evento por enquanto</Text></View>)}
                refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={this._refreshSnapshot} colors={this.refreshColors} /> }
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
        events: state.publishedEventsReducer
    };
}

const mapDispatchToProps = (dispatch)=>{
    return {
        refreshSnapshot: (snapshot)=>{dispatch({ type: 'UPDATE_PUBLISHED_SNAPSHOT', payload:snapshot })},
        setTempDraft: (temp)=> dispatch({ type: 'UPDATE_TEMP_DRAFT', payload: temp })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);