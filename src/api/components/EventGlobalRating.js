import React from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Dimensions,
    View,
    Text
} from 'react-native';

class EventGlobalRating extends React.Component {
    render(){
        return (
            <View style={styles.container}>
                <Text>Eae</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ccc'
    }
});

const mapStateToProps = (state)=>({

});

const mapDispatchToProps = (dispatch)=>({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(EventGlobalRating);