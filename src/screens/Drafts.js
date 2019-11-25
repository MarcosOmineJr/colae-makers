import React from 'react';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {
    Dimensions,
    StyleSheet,
    View,
    FlatList,
    Text,
    Image
} from 'react-native';
import ColaeAPI from '../api';

const { height } = Dimensions.get('window');

const { ColUI } = ColaeAPI;

class Drafts extends React.Component {

    constructor(props){
        super(props);

        this._renderEvents = this._renderEvents.bind(this);

        const unsubscribe = firestore().collection('events').where('published', '==', false).orderBy('createdAt', 'desc').onSnapshot({
            error: (e)=>console.log('Erro:', e),
            next: (QuerySnapshot)=>{
                let data = [];
                QuerySnapshot.docs.map((e, key)=>{
                    data.push({ ...e.data(), key: key.toString(), ref: e.id });
                })
                props.refreshSnapshot(data);
            }
        });
    }

    _imageRenderIf(event, condition){
        if(condition){
            return (
                <Image source={{uri: event.photos[0]}} style={styles.eventCoverImage} resizeMode='cover' />
            );
        } else {
            return (
                <View style={[styles.eventCoverImage, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={styles.noInfo}>Sem Imagem</Text>
                </View>
            );
        }
    }

    _descriptionRenderIf(event, condition){
        if(condition){
            return (
                <Text style={styles.eventDescription} numberOfLines={4}>{event.description}</Text>
            );
        } else {
            return (
                <Text style={styles.noInfo}>Sem Descrição</Text>
            );
        }
    }

    _renderEvents(event){
        return (
            <ColUI.Card colSpan={6} contentContainerStyle={[styles.eventCard, { backgroundColor: this.props.ColUITheme.main }]} >
                {this._imageRenderIf(event, event.photos != undefined)}
                <View style={styles.eventInfoContainer}>
                    <Text style={styles.eventName} numberOfLines={1}>{event.name}</Text>
                    {this._descriptionRenderIf(event, event.description != undefined)}
                </View>
            </ColUI.Card>
        );
    }

    render(){
        return (
            <View style={styles.container} >
                <FlatList
                contentContainerStyle={styles.eventCardsContainer}
                data={this.props.events}
                renderItem={({item})=>this._renderEvents(item)}
                ListHeaderComponent={()=>(<Text style={[styles.headerComponentText, { color: this.props.ColUITheme.main }]}>Esses são os seus rascunhos de evento:</Text>)}
                ListEmptyComponent={()=>(<View style={styles.emptyListContainer}><Text>Você não tem nenhum rascunho por enquanto</Text></View>)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    eventCardsContainer:{
        flex: 1,
        alignItems: 'center',
        paddingTop: 10
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
        height: height*0.24,
        marginBottom: 20
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
    },
    noInfo:{
        color: '#fff',
        fontSize: 16,
        fontStyle: 'italic'
    }
})

const mapStateToProps = (state)=>{
    return {
        ColUITheme: state.themesReducer.ColUITheme,
        events: state.draftsReducer.remote
    };
}

const mapDispatchToProps = (dispatch)=>{
    return {
        refreshSnapshot: (snapshot)=>{dispatch({ type: 'UPDATE_DRAFTS_SNAPSHOT', payload:snapshot })}
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(Drafts);