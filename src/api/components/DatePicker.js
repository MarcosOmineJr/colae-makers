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
        let dia = date.getDate().toString().length < 2 ? '0'+date.getDate().toString() : date.getDate().toString();
        let mes = (date.getMonth()+1).toString().length < 2 ? '0'+(date.getMonth()+1).toString() : (date.getMonth()+1).toString();
        let ano = date.getFullYear().toString().substr(2, 4);

        return (
            <TouchableOpacity style={[styles.container, { borderBottomColor: ColUITheme.main }]} onPress={onPress}>
                <Text style={[styles.date, { color: ColUITheme.main }]}>{`${dia}/${mes}/${ano}`}</Text>
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