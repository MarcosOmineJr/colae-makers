import React from 'react';

import { connect } from 'react-redux';

import { Dimensions } from 'react-native';

import {
    Item,
    Label,
    Input
} from 'native-base';

const { width } = Dimensions.get('screen');

class TextInput extends React.Component {

    _componentWidth = ((width*0.1027)*this.props.colSpan)+((width*0.055)*(this.props.colSpan-1));

    render(){

        const { ColUITheme, style, label, labelStyle, onChangeText, keyboardType, secureTextEntry, textStyle, value } = this.props;

        return (
            <Item floatingLabel style={[{ borderColor: ColUITheme.main, marginBottom: 20, width: this._componentWidth }, style]}>
                <Label style={[{ color: ColUITheme.main }, labelStyle]}>{ label }</Label>
                <Input style={[{ color: ColUITheme.purple.light }, textStyle]} value={value} onChangeText={(t)=>{onChangeText(t)}} keyboardType={keyboardType} secureTextEntry={secureTextEntry} selectionColor={ ColUITheme.main } />
            </Item>
        );
    }
}

TextInput.defaultProps = {
    colSpan: 5.2,
    label: 'label',
    onChangeText: ()=>{},
    keyboardType: 'default',
    secureTextEntry: false
}

const mapStateToProps = (state)=>{
    return {
        ColUITheme: state.themesReducer.ColUITheme
    };
}

const mapDispatchtoProps = (dispatch)=>{
    return {};
}

export default connect(mapStateToProps, mapDispatchtoProps)(TextInput);