import React from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import ColaeAPI from '../api';

const { height, width } = Dimensions.get('window');

const { ColUI } = ColaeAPI;

class Home extends React.Component {

    constructor(props){
        super(props);

        this._renderEvents = this._renderEvents.bind(this);

        const unsubscribe = firestore().collection('events').where('published','==',true).onSnapshot({
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

    _renderEvents(event){
        return (
            <ColUI.Card colSpan={6} contentContainerStyle={[styles.eventCard, { backgroundColor: this.props.ColUITheme.main }]} >
                <Image source={{uri: event.photos[0]}} style={styles.eventCoverImage} resizeMode='cover' />
                <View style={styles.eventInfoContainer}>
                    <Text style={styles.eventName} numberOfLines={1}>{event.name}</Text>
                    <Text style={styles.eventDescription} numberOfLines={4}>{event.description}</Text>
                </View>
            </ColUI.Card>
        );
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.topButtonsContainer} >
                    <ColUI.Button secondary label='criar evento' onPress={()=>this.props.navigation.navigate('CreateDraft')} />
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('Filter')} >
                        <Icon name='tune' type='MaterialIcons' style={[styles.iconButton, { color: this.props.ColUITheme.main }]} />
                    </TouchableOpacity>
                </View>
                <FlatList
                contentContainerStyle={styles.eventCardsContainer}
                data={this.props.events}
                renderItem={({item})=>this._renderEvents(item)}
                ListHeaderComponent={()=>(<Text style={[styles.headerComponentText, { color: this.props.ColUITheme.main }]}>Esses são os eventos que você gerencia:</Text>)}
                ListEmptyComponent={()=>(<View style={styles.emptyListContainer}><Text>Você não gerencia nenhum evento por enquanto</Text></View>)}
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
        justifyContent: 'space-between',
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
        flex: 1,
        alignItems: 'center',
        paddingTop: 10
    },
    eventCard:{
        padding: 0,
        alignItems: 'flex-start',
        flexDirection: 'row',
        height: height*0.24
    },
    eventCoverImage:{
        height: '100%',
        width: '50%',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
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
        refreshSnapshot: (snapshot)=>{dispatch({ type: 'UPDATE_PUBLISHED_SNAPSHOT', payload:snapshot })}
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);