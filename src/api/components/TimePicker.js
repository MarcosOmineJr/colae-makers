import React from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';

class TimePicker extends React.Component {
    render(){

        const { onPress, ColUITheme, time } = this.props;

        return (
            <TouchableOpacity style={[styles.container, { borderBottomColor: ColUITheme.main }]} onPress={onPress}>
                <Text style={[styles.time, { color: ColUITheme.main }]}>{ time.toLocaleTimeString('pt-BR').slice(0, -3) }</Text>
            </TouchableOpacity>
        );
    }
}

TimePicker.defaultProps = {
    time: new Date(2000, 1, 2, 0, 0),
    onPress: ()=>{}
}

const styles = StyleSheet.create({
    container:{
        borderBottomWidth: 1
    },
    time:{
        fontSize: 16
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
})

export default connect(mapStateToProps)(TimePicker);