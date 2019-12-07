import React from 'react';

import { connect } from 'react-redux';

import {
    TouchableOpacity,
    Text,
    Dimensions,
    StyleSheet,
    ActivityIndicator
} from 'react-native';

import { shadow } from './styles';

const { width, height } = Dimensions.get('screen');

class Button extends React.Component {

    constructor(props){
        super(props);
    }

    _componentHeight = height*0.047;
    _componentWidth = ((width*0.1027)*this.props.colSpan)+((width*0.055)*(this.props.colSpan-1));

    render(){
        if(!this.props.textOnly){
            if(!this.props.secondary){
                if(this.props.loading){
                    return (
                        <TouchableOpacity
                        style={[styles.container, { height: this._componentHeight, width: this._componentWidth },this.props.disabled?{backgroundColor: '#ccc'}:this.props.blue?{ backgroundColor: this.props.ColUITheme.accent}:{ backgroundColor: this.props.ColUITheme.main}, shadow, this.props.contentContainerStyle]}>
                            <ActivityIndicator size='small' color={this.props.ColUITheme.background} />
                        </TouchableOpacity>
                    );
                }
                return (
                    <TouchableOpacity
                    style={[styles.container, { height: this._componentHeight, width: this._componentWidth },this.props.disabled?{backgroundColor: '#ccc'}:this.props.blue?{ backgroundColor: this.props.ColUITheme.accent}:{ backgroundColor: this.props.ColUITheme.main}, shadow, this.props.contentContainerStyle]}
                    onPress={this.props.disabled?()=>{}:this.props.onPress}>
                        <Text style={styles.label}>{this.props.label.toUpperCase()}</Text>
                    </TouchableOpacity>
                );
            } else {
                return (
                    <TouchableOpacity
                    style={[styles.container, { height: this._componentHeight, width: this._componentWidth },this.props.disabled?{borderWidth:1, borderColor: '#ccc'}:this.props.blue?{ borderWidth:1, borderColor: this.props.ColUITheme.accent}:{ borderWidth:1, borderColor: this.props.ColUITheme.main}, this.props.contentContainerStyle]}
                    onPress={this.props.disabled?()=>{}:this.props.onPress}>
                        <Text style={[styles.label, this.props.disabled?{color: '#ccc'}:this.props.blue?{ color: this.props.ColUITheme.accent }:{ color: this.props.ColUITheme.main }]}>{this.props.label.toUpperCase()}</Text>
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
        color: '#FFFFFF'
    },
    iconContainer:{
        flex: 1
    },
    textContainer:{
        flex: 3
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
});

export default connect(mapStateToProps)(Button);