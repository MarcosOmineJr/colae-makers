import React from 'react';
import { firebase } from '@react-native-firebase/auth';
import { connect } from 'react-redux';

import {
    View,
    ActivityIndicator,
    StyleSheet
} from 'react-native';

class AuthCheck extends React.Component {
    
    constructor(props){
        super(props);

        this.authentication = firebase.auth();

        this.authentication.onAuthStateChanged(user=>{
            if(user){
                this.props.navigation.navigate('Authenticated');
            } else {
                this.props.navigation.navigate('Unauthenticated');
            }
        });
    }

    render(){
        return (
            <View style={[styles.container, {backgroundColor: this.props.ColUITheme.background}]}>
                <ActivityIndicator size='large' color={this.props.ColUITheme.main} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text:{
        fontSize: 30
    }
});


const mapStateToProps = (state)=>{
    return {
        ColUITheme: state.themesReducer.ColUITheme
    };
}

const mapDispatchToProps = (dispatch)=>{
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthCheck);