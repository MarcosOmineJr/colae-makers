import React from 'react';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {
    Dimensions,
    StyleSheet,
    View,
    FlatList,
    Text,
    Image,
    TouchableHighlight
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import ColaeAPI from '../api';

const { height, width } = Dimensions.get('window');

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
            <TouchableHighlight style={{ marginBottom: 20 }} onPress={()=>{this.props.navigation.navigate('DraftProgress', { draftId: event.ref })}}>
                <ColUI.Card colSpan={6} contentContainerStyle={[styles.eventCard, { backgroundColor: this.props.ColUITheme.main }]} >
                    {this._imageRenderIf(event, event.photos != undefined)}
                    <View style={styles.eventInfoContainer}>
                        <Text style={styles.eventName} numberOfLines={1}>{event.name}</Text>
                        {this._descriptionRenderIf(event, event.description != undefined)}
                    </View>
                </ColUI.Card>
            </TouchableHighlight>
        );
    }

    render(){
        return (
            <View style={styles.container}>
                <NavigationEvents onDidFocus={()=>this.props.setTempDraft(null)} />
                <View style={styles.topButtonsContainer} >
                    <ColUI.IconButton label='CRIAR EVENTO' iconName='add' onPress={()=>this.props.navigation.navigate('CreateDraft')} />
                </View>
                <FlatList
                contentContainerStyle={styles.eventCardsContainer}
                data={this.props.events}
                renderItem={({item})=>this._renderEvents(item)}
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
    topButtonsContainer:{
        height: '10%',
        width,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20
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
        height: height*0.24
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
        refreshSnapshot: (snapshot)=>{dispatch({ type: 'UPDATE_DRAFTS_SNAPSHOT', payload:snapshot })},
        setTempDraft: (temp)=> dispatch({ type: 'UPDATE_TEMP_DRAFT', payload: temp })
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(Drafts);