import React from 'react';

import {
    TouchableOpacity,
    Text,
    Dimensions,
    StyleSheet
} from 'react-native';

import Colae, { shadow } from './styles';

const { width, height } = Dimensions.get('screen');

export default class Button extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            theme: Colae.lightTheme
        }
        this._getTheme = this._getTheme.bind(this);
    }

    _componentHeight = height*0.047;
    _componentWidth = ((width*0.1027)*this.props.colSpan)+((width*0.055)*(this.props.colSpan-1));

    componentDidMount(){
        this._getTheme();
    }

    async _getTheme(){
        let s = this.state;
        s.theme = await Colae.getColorTheme();
        this.setState(s);
    }

    render(){
        if(!this.props.textOnly){
            if(!this.props.secondary){
                return (
                    <TouchableOpacity
                    style={[styles.container, { height: this._componentHeight, width: this._componentWidth },this.props.blue?{ backgroundColor: this.state.theme.accent}:{ backgroundColor: this.state.theme.main}, shadow, this.props.contentContainerStyle]}
                    onPress={this.props.onPress}>
                        <Text style={styles.label}>{this.props.label.toUpperCase()}</Text>
                    </TouchableOpacity>
                );
            } else {
                return (
                    <TouchableOpacity
                    style={[styles.container, { height: this._componentHeight, width: this._componentWidth },this.props.blue?{ borderWidth:1, borderColor: this.state.theme.accent}:{ borderWidth:1, borderColor: this.state.theme.main}, this.props.contentContainerStyle]}
                    onPress={this.props.onPress}>
                        <Text style={[styles.label, this.props.blue?{ color: this.state.theme.accent }:{ color: this.state.theme.main }]}>{this.props.label.toUpperCase()}</Text>
                    </TouchableOpacity>
                );
            }
        } else {
            return (
                <TouchableOpacity
                style={[styles.container, { height: this._componentHeight, width: this._componentWidth }, this.props.contentContainerStyle]}
                onPress={this.props.onPress}>
                    <Text style={[styles.label, { color: this.props.labelColor, letterSpacing:0 }]}>{this.props.label}</Text>
                </TouchableOpacity>
            );
        }
    }
}

Button.defaultProps = {
    colSpan: 3,
    label: 'label',
    onPress: ()=>{},
    labelColor: '#000000'
}

const styles = StyleSheet.create({
    container:{
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    label:{
        fontFamily: 'roboto',
        color: '#FFFFFF',
        letterSpacing: 2
    }
});