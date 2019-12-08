import React from 'react';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    TouchableOpacity
} from 'react-native';

const { width, height } = Dimensions.get('screen');

class Steps extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            done: []
        }

        this._renderSteps = this._renderSteps.bind(this);
        this._fetchFirebase = this._fetchFirebase.bind(this);
    }

    async _fetchFirebase(){
        console.log('rodou');
        let s = this.state;
        const { eventRef, user } = this.props;

        
        let event = firestore().collection('users').doc(user.firebaseRef).collection('events').doc(eventRef);
        let response = await event.get();
        response = response.data();

        if(response.photos && response.categories && response.keywords){
            s.done.push(true);
        } else {
            s.done.push(false);
        }
        if(response.description){
            s.done.push(true);
        } else {
            s.done.push(false);
        }
        if(response.location && response.dates){
            s.done.push(true);
        } else {
            s.done.push(false);
        }
        if(response.producers){
            s.done.push(true);
        } else {
            s.done.push(false);
        }
        if(response.tickets){
            s.done.push(true);
        } else {
            s.done.push(false);
        }

        this.setState(s);
    }

    componentDidMount(){
        this._fetchFirebase();
    }

    _renderSteps(step, index, length){

        const { done } = this.state;
        const { ColUITheme, eventRef } = this.props;

        if(index == 0){
            return (
                <TouchableOpacity key={index} style={styles.stepContainer} onPress={()=>this.props.navigation.navigate(step.routename, { eventRef: eventRef })}>
                    <View style={styles.stepIndicatorContainer}>
                        <View style={styles.topConnectorContainer} />
                        <View style={[styles.circleContainer, {justifyContent: 'flex-end'}]}>
                            <View style={[styles.bar, {height: '50%'}, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                            <View style={[styles.circle, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={styles.bottomConnectorContainer}>
                            <View style={[styles.connector, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                    </View>
                    <View style={styles.stepNameContainer}>
                        <Text style={[styles.stepName, done[index] ? { fontWeight: 'bold', color: ColUITheme.main } : { fontWeight: 'normal', color: ColUITheme.gray.light } ]}>{step.description}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if(index == (length-1)){
            return (
                <TouchableOpacity key={index} style={styles.stepContainer} onPress={()=>this.props.navigation.navigate(step.routename, { eventRef: eventRef })}>
                    <View style={styles.stepIndicatorContainer}>
                        <View style={styles.topConnectorContainer} >
                            <View style={[styles.connector, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={[styles.circleContainer, {justifyContent: 'flex-start'}]}>
                            <View style={[styles.bar, {height: '50%'}, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                            <View style={[styles.circle, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={styles.bottomConnectorContainer} />
                    </View>
                    <View style={styles.stepNameContainer}>
                    <Text style={[styles.stepName, done[index] ? { fontWeight: 'bold', color: ColUITheme.main } : { fontWeight: 'normal', color: ColUITheme.gray.light } ]}>{step.description}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity key={index} style={styles.stepContainer} onPress={()=>this.props.navigation.navigate(step.routename, { eventRef: eventRef })}>
                    <View style={styles.stepIndicatorContainer}>
                        <View style={styles.topConnectorContainer} >
                            <View style={[styles.connector, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={styles.circleContainer}>
                            <View style={[styles.bar, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                            <View style={[styles.circle, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={styles.bottomConnectorContainer} >
                            <View style={[styles.connector, done[index]?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                    </View>
                    <View style={styles.stepNameContainer}>
                    <Text style={[styles.stepName, done[index] ? { fontWeight: 'bold', color: ColUITheme.main } : { fontWeight: 'normal', color: ColUITheme.gray.light } ]}>{step.description}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    render(){
        return (
            <View style={styles.container}>
                {this.props.stepsData.map((step, index)=>this._renderSteps(step, index,this.props.stepsData.length))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        width
    },
    stepContainer:{
        flex: 1,
        flexDirection:'row'
    },
    stepIndicatorContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topConnectorContainer:{
        flex:2,
        alignItems: 'center'
    },
    connector:{
        backgroundColor: '#ccc',
        height: '100%',
        width: 3
    },
    bar:{
        backgroundColor: '#ccc',
        height: '100%',
        width: 3
    },
    circleContainer:{
        width: '100%',
        height: 20,
        alignItems: 'center',
    },
    circle:{
        position: 'absolute',
        backgroundColor: '#ccc',
        height: 15,
        width: 15,
        borderRadius: 7.5
    },
    bottomConnectorContainer:{
        flex:2,
        alignItems: 'center'
    },
    stepNameContainer:{
        flex: 3,
        justifyContent: 'center',
        paddingRight: 20
    },
    stepName:{
        fontSize: 18
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme,
    user: state.userReducer
});

export default connect(mapStateToProps)(Steps);