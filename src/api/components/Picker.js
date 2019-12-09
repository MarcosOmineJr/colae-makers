import React from 'react';

import { connect } from 'react-redux';

import { Dimensions } from 'react-native';

import {
    Item,
    Label,
    Picker
} from 'native-base';

const { width } = Dimensions.get('screen');

class TextInput extends React.Component {

    _componentWidth = ((width*0.1027)*this.props.colSpan)+((width*0.055)*(this.props.colSpan-1));

    render(){

        const { ColUITheme, style, onValueChange, value, pickerItems, state } = this.props;
        //console.log('textinput autoCapitalize: ', autoCapitalize);

        return (
            <Item picker style={[{ borderColor: ColUITheme.main, marginBottom: 20, width: this._componentWidth }, style]}>
                <Picker
                mode='dialog'
                style={{color: ColUITheme.main}}
                onValueChange={onValueChange}
                selectedValue={value}
                placeholderIconColor={ColUITheme.main}
                >
                    <Picker.Item style={{color: ColUITheme.main}} label='Estado' value={undefined} />
                    {
                    pickerItems.map((item, key)=>(
                        <Picker.Item label={state? item.sigla : item} value={state? item.sigla : item} key={item.id.toString()} />
                    ))
                    }
                </Picker>
            </Item>
        );
    }
}

TextInput.defaultProps = {
    colSpan: 5.2,
    placeholder: 'Placeholder',
    pickerItems: [],
    state: false
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