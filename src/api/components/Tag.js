import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import {
    Badge
} from 'native-base';

class Tag extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            active: false
        }

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

        this._toggleColor = this._toggleColor.bind(this);
    }

    _toggleColor(){
        let s = this.state;
        s.active = s.active ? false : true;
        this.setState(s);
    }

    render(){

        const { active } = this.state;
        const { label, /*active,*/ onPress, contentContainerStyle } = this.props;

        return (
            <TouchableOpacity style={contentContainerStyle} onPress={()=>{this._toggleColor(); onPress()}}>
                <Badge style={[styles.container, { borderColor: active ? this._bordercolors.active : this._bordercolors.inactive, backgroundColor: active ? this._backgroundColors.active : this._backgroundColors.inactive }]}>
                    <Text style={[styles.label, { color: active ? this._labelcolors.active : this._labelcolors.inactive }]}>{ label }</Text>
                </Badge>
            </TouchableOpacity>
        );
    }
}

Tag.defaultProps = {
    label: 'label',
    active: false,
    onPress: ()=>{}
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