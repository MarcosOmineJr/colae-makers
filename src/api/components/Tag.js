import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import {
    Badge
} from 'native-base';

class Tag extends React.Component {

    constructor(props){
        super(props);

        this._bordercolors = {
            inactive: '#cccccc',
            active: props.ColUITheme.main
        }

        this._labelcolors = {
            inactive: '#cccccc',
            active: '#000000'
        }
        this._backgroundColors = {
            inactive: props.ColUITheme.background,
            active: '#fff5f8'
        }

    }

    render(){

        const { label, active, onPress, contentContainerStyle, user } = this.props;

        return (
            <TouchableOpacity style={contentContainerStyle} onPress={onPress}>
                <Badge style={[styles.container, { borderColor: active || user ? this._bordercolors.active : this._bordercolors.inactive, backgroundColor: active || user ? this._backgroundColors.active : this._backgroundColors.inactive }]}>
                    <Text style={[styles.label, { color: active || user ? this._labelcolors.active : this._labelcolors.inactive }]}>{ label }</Text>
                </Badge>
            </TouchableOpacity>
        );
    }
}

Tag.defaultProps = {
    label: 'label',
    active: false,
    onPress: ()=>{},
    user: false
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    label:{
        marginHorizontal: 7
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
})

export default connect(mapStateToProps)(Tag);