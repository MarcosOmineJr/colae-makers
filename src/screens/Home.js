import React from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
    Image,
    StyleSheet,
    ActivityIndicator,
    Dimensions
} from 'react-native';

import { connect } from 'react-redux';

import firestore from '@react-native-firebase/firestore';

import ColaeAPI from '../api';

const { height } = Dimensions.get('window');

const { ColUI } = ColaeAPI;

class Home extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data: [],
            loading: false
        }

        this._renderEvents = this._renderEvents.bind(this);

        const unsubscribe = firestore().collection('events').onSnapshot({
            error: (e)=>console.log('Erro:', e),
            next: (QuerySnapshot)=>{
                let data = [];
                QuerySnapshot.docs.map((e, key)=>{
                    data.push({ ...e.data(), key: key.toString(), ref: e.id });
                })
                props.refreshSnapshot(data);
            }
        })
    }

    componentDidMount(){
        let s = this.state;
        s.data = this.props.events;
        s.loading = false;
        this.setState(s);
    }

    _renderEvents(event){
        return (
            <ColUI.Card colSpan={6} contentContainerStyle={[styles.eventCard, { backgroundColor: this.props.ColUITheme.main }]} >
                <Image source={{uri: event.photos[0]}} style={styles.eventCoverImage} resizeMode='cover' />
                <View style={styles.eventInfoContainer}>
                    <Text style={styles.eventName} numberOfLines={1}>{event.name}</Text>
                    <Text style={styles.eventDescription} numberOfLines={6}>{event.description}</Text>
                </View>
            </ColUI.Card>
        );
    }

    render(){
        if(this.state.loading){
            return (
                <View style={[styles.container, { justifyContent: 'center' }]}>
                    <ActivityIndicator size='large' color={this.props.ColUITheme.main} />
                </View>
            )
        } else{
            return (
                <FlatList contentContainerStyle={styles.container}
                data={this.props.events}
                renderItem={({item})=>this._renderEvents(item)} />
            );
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        paddingTop: 20
    },
    text:{
        fontSize: 30,
        marginBottom: 20
    },
    eventCoverImage:{
        height: height*0.2683,
        width: '50%',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    eventCard:{
        padding: 0,
        alignItems: 'flex-start',
        flexDirection: 'row'
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
    eventDescription:{
        color: '#ffffff',
    }
});

const mapStateToProps = (state)=>{
    return {
        ColUITheme: state.themesReducer.ColUITheme,
        events: state.managedEventsReducer
    };
}

const mapDispatchToProps = (dispatch)=>{
    return {
        refreshSnapshot: (snapshot)=>{dispatch({ type: 'UPDATE_SNAPSHOT', payload:snapshot })}
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);