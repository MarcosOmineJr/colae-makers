import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import { connect } from 'react-redux';

class DatePicker extends React.Component {

    render(){

        const { ColUITheme, date, onPress } = this.props;

        return (
            <TouchableOpacity style={[styles.container, { borderBottomColor: ColUITheme.main }]} onPress={onPress}>
                <Text style={[styles.date, { color: ColUITheme.main }]}>{ date.toLocaleDateString('pt-BR', {day: '2-digit', month:'2-digit', year: '2-digit'}) }</Text>
            </TouchableOpacity>
        );
    }
}

DatePicker.defaultProps = {
    date: new Date(),
    onPress: ()=>{}
}

const styles = StyleSheet.create({
    container:{
        borderBottomWidth: 1
    },
    date:{
        fontSize: 16
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
})

export default connect(mapStateToProps)(DatePicker);

//date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear().toString().replace('20','')