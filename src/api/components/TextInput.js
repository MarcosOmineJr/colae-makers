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
        return (
            <Item floatingLabel style={[{ borderColor: this.props.ColUITheme.main, marginBottom: 20, width: this._componentWidth }, this.props.style]}>
                <Label style={[{ color: this.props.ColUITheme.main }, this.props.labelStyle]}>{ this.props.label }</Label>
                <Input onChangeText={(t)=>{this.props.onChangeText(t)}} />
            </Item>
        );
    }
}

TextInput.defaultProps = {
    colSpan: 5.2,
    label: 'label',
    onChangeText: ()=>{}
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