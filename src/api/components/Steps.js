import React from 'react';
import { connect } from 'react-redux';
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
        this._renderSteps = this._renderSteps.bind(this);
    }

    _renderSteps(step, index, length){
        console.log('_renderSteps de Steps foi chamado', step);
        if(index == 0){
            return (
                <TouchableOpacity key={index} style={styles.stepContainer} onPress={()=>this.props.navigation.navigate(step.routename)}>
                    <View style={styles.stepIndicatorContainer}>
                        <View style={styles.topConnectorContainer} />
                        <View style={[styles.circleContainer, {justifyContent: 'flex-end'}]}>
                            <View style={[styles.bar, {height: '50%'}, step.done?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                            <View style={[styles.circle, step.done?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={styles.bottomConnectorContainer}>
                            <View style={[styles.connector, step.done?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                    </View>
                    <View style={styles.stepNameContainer}>
                        <Text style={styles.stepName}>{step.description}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if(index == (length-1)){
            return (
                <TouchableOpacity key={index} style={styles.stepContainer} onPress={()=>this.props.navigation.navigate(step.routename)}>
                    <View style={styles.stepIndicatorContainer}>
                        <View style={styles.topConnectorContainer} >
                            <View style={[styles.connector, step.done?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={[styles.circleContainer, {justifyContent: 'flex-start'}]}>
                            <View style={[styles.bar, {height: '50%'}, step.done?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                            <View style={[styles.circle, step.done?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={styles.bottomConnectorContainer} />
                    </View>
                    <View style={styles.stepNameContainer}>
                        <Text style={styles.stepName}>{step.description}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity key={index} style={styles.stepContainer} onPress={()=>this.props.navigation.navigate(step.routename)}>
                    <View style={styles.stepIndicatorContainer}>
                        <View style={styles.topConnectorContainer} >
                            <View style={[styles.connector, step.done?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={styles.circleContainer}>
                            <View style={[styles.bar, step.done?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                            <View style={[styles.circle, step.done?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                        <View style={styles.bottomConnectorContainer} >
                            <View style={[styles.connector, step.done?{ backgroundColor: this.props.ColUITheme.main } : { backgroundColor: '#ccc' }]} />
                        </View>
                    </View>
                    <View style={styles.stepNameContainer}>
                        <Text style={styles.stepName}>{step.description}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    render(){
        console.log('render de steps foi chamado');
        return (
            <View style={styles.container}>
                {this.props.stepsData.map((step, index)=>this._renderSteps(step, index,this.props.stepsData.length))}
            </View>
        );
    }
}

Steps.defaultProps = {
    stepsData: null
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
        width: 5
    },
    bar:{
        backgroundColor: '#ccc',
        height: '100%',
        width: 5
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
        fontSize: 16
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
});

export default connect(mapStateToProps)(Steps);