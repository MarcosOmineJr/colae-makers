import React from 'react';
import { connect } from 'react-redux';
import { firebase } from '@react-native-firebase/firestore';
import ColaeAPI from '../api';
import { shadow } from '../api/components/styles';
import { Button, Icon } from 'native-base';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    ActivityIndicator,
    ScrollView
} from 'react-native';

const { ColUI } = ColaeAPI;
const { width, height } = Dimensions.get('window');

class EventScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            event: {
                photos:['']
            },
            loading: true
        }

        this._fetchFirebase = this._fetchFirebase.bind(this);
        this._fetchProducersInfo = this._fetchProducersInfo.bind(this);
    }

    componentDidMount(){
        this._fetchFirebase();
        this._fetchProducersInfo();
    }

    async _fetchFirebase(){
        const { firebaseRef } = this.props.navigation.state.params;
        let s = this.state;
        let data = await firebase.firestore().doc('events/'+firebaseRef).get();
        s.event = data.data();

        this.setState(s);
    }

    async _fetchProducersInfo(){

        let s = this.state;
        const { firebaseRef } = this.props.navigation.state.params;

        let event = await firebase.firestore().doc('events/'+firebaseRef).get();
        event = event.data();

        let people = [];

        if(event.producers){
            event.producers.forEach(async (producer)=>{
                let doc = await firebase.firestore().collection('users').doc(producer).get();
                if(doc.exists){
                    let parsedDoc = doc.data();
                    people.push({lastname: parsedDoc.lastname, name: parsedDoc.name, uid: doc.id, collection:'users' });
                } else {
                    doc = await firebase.firestore().collection('services').doc(producer).get();
                    let parsedDoc = doc.data();
                    people.push({lastname: parsedDoc.lastname, name: parsedDoc.name, uid: doc.id, collection:'services' });
                }
                s.event.producers = people;
                s.loading = false;
                this.setState(s);
            })
        }
    }

    _formatDate(unixDate){
        let date = new Date(unixDate);
        let day = date.getDate().toString().length > 1 ? date.getDate() : '0'+date.getDate().toString();
        let month;
        let hour = date.getHours().toString().length > 1 ? date.getHours() : '0'+date.getHours().toString();
        let minute = date.getMinutes().toString().length > 1 ? date.getMinutes() : '0'+date.getMinutes().toString();
        switch(date.getMonth()){
            case 0:
                month = 'Janeiro';
                break;
            case 1:
                month = 'Fevereiro';
                break;
            case 2:
                month = 'Março';
                break;
            case 3:
                month = 'Abril';
                break;
            case 4:
                month = 'Maio';
                break;
            case 5:
                month = 'Junho';
                break;
            case 6:
                month = 'Julho';
                break;
            case 7:
                month = 'Agosto';
                break;
            case 8:
                month = 'Setembro';
                break;
            case 9:
                month = 'Outubro';
                break;
            case 10:
                month = 'Novembro';
                break;
            case 11:
                month = 'Dezembro';
                break;
        }
        return `${day} de ${month} de ${date.getFullYear()} às ${hour}:${minute}`;
    }

    render(){

        const { event, loading } = this.state;
        const { ColUITheme, navigation } = this.props;

        if(loading){
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={ColUITheme.main} />
                </View>
            )
        }

        return (
            <ScrollView>
                <View style={[styles.basicInfoContainer, shadow]}>
                    <ColUI.EventImageSlider photos={event.photos} />
                    <View style={styles.textualBasicInfo}>
                        <Text style={[styles.name, { color: ColUITheme.gray.light }]}>{event.name}</Text>
                        <View style={[styles.metricsAndAvaliation, { borderBottomColor: ColUITheme.main }]}>
                            <View style={{flex: 1}} >
                                <ColUI.EventGlobalRating lightContent={false} rating={event.rating} avaliationCount={event.avaliation_count} />
                                <Button transparent onPress={()=>navigation.navigate('Avaliations')}>
                                    <Text style={[styles.btnLabel, { color: ColUITheme.main }]}>Ver detalhes da avaliação ></Text>
                                </Button>
                            </View>
                            <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}} >
                                <ColUI.Button label='ver métricas' onPress={()=>navigation.navigate('Metrics')} />
                            </View>
                        </View>

                        <View style={styles.locationDurationAndPricesContainer}>
                            <View style={styles.locationAndDurationContainer}>
                                <View style={styles.locationContainer}>
                                    <Icon type='Entypo' name='location-pin' style={styles.icon} />
                                    <Button transparent onPress={()=>{alert('foi de novo')}}>
                                        <Text style={[styles.location, { color: ColUITheme.main }]}>{event.location}</Text>
                                    </Button>
                                </View>
                                <View style={styles.durationContainer}>
                                    <Icon type='MaterialIcons' name='query-builder' style={styles.icon} />
                                    <View style={styles.durationTextContainer}>
                                        <Text style={[styles.durationTitle, { color: ColUITheme.gray.light }]}>Começa:</Text>
                                        <Text style={[styles.date, { color: ColUITheme.gray.light, marginBottom: 10 }]}>{this._formatDate(event.dates.from)}</Text>
                                        <Text style={[styles.durationTitle, { color: ColUITheme.gray.light }]}>Termina:</Text>
                                        <Text style={[styles.date, { color: ColUITheme.gray.light, marginBottom: 10 }]}>{this._formatDate(event.dates.to)}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.PricesContainer}>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingLeft: 25}}>
                                    <Text style={{ color: ColUITheme.gray.light }}>A partir de:</Text>
                                    <Text style={{ color: ColUITheme.main, fontWeight: 'bold', fontSize: 16 }}>R$ {parseFloat(event.tickets[0].fullprice).toFixed(2).replace('.',',')}</Text>
                                </View>
                                <View style={{flex: 1}} />
                            </View>
                        </View>

                        <Text style={[styles.name, { color: ColUITheme.gray.light, marginTop: 20 }]}>Descrição</Text>
                        <Text style={styles.description}> {event.description} </Text>

                        <Text style={[styles.name, { color: ColUITheme.gray.light, marginTop: 20, marginBottom: 10 }]}>Organizado por:</Text>
                        <View style={styles.tagRow}>
                            {
                            event.producers.map((producer, key)=>(
                                <ColUI.Tag key={key.toString()} user contentContainerStyle={styles.tag} label={producer.name+' '+producer.lastname} onPress={()=>navigation.navigate('Profile', { firebaseRef: producer.uid, collection: producer.collection })} />
                            ))
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    loadingContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    basicInfoContainer:{

    },
    textualBasicInfo:{
        padding: 20
    },
    name:{
        fontSize: 18,
        fontWeight: 'bold'
    },
    metricsAndAvaliation:{
        width: width-40,
        flexDirection: 'row',
        paddingBottom: 20,
        borderBottomWidth: 1
    },
    btnLabel:{
        fontStyle: 'italic'
    },
    locationDurationAndPricesContainer:{
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    locationAndDurationContainer:{
        flex: 1.5
    },
    PricesContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    locationContainer:{
        flex: 1,
        flexDirection: 'row'
    },
    durationContainer:{
        flex: 1,
        flexDirection: 'row'
    },
    icon:{
        fontSize: 30,
        marginTop: 4,
        marginRight: 5
    },
    location:{
        fontSize: 16,
        textDecorationLine: 'underline'
    },
    durationTextContainer:{
        paddingTop: 8
    },
    durationTitle:{
        fontWeight: 'bold',
        fontSize: 16
    },
    date:{
        fontStyle: 'italic'
    },
    description:{
        marginTop: 10
    },
    tagRow:{
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    tag:{
        marginBottom: 10,
        marginRight: 10
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
})

export default connect(mapStateToProps)(EventScreen);