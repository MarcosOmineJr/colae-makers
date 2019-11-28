import React from 'react';
import { connect } from 'react-redux';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';

import { Icon } from 'native-base';

const { height, width } = Dimensions.get('screen');

class IconButton extends React.Component {

    _componentHeight = height*0.047;
    _componentWidth = ((width*0.1027)*this.props.colSpan)+((width*0.055)*(this.props.colSpan-1));

    render(){
        return (
            <TouchableOpacity style={[styles.container, { backgroundColor: 'transparent', width: this._componentWidth, height: this._componentHeight }]} onPress={this.props.onPress}>
                <View style={styles.iconContainer}>
                    <Icon type={this.props.iconFamily} name={this.props.iconName} fontSize={this.props.iconSize} style={{ color: this.props.color }} />
                </View>
                <View style={styles.labelContainer}>
                    <Text style={[styles.label, { color: this.props.color }]}>{this.props.label}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

IconButton.defaultProps = {
    colSpan: 3,
    label: 'label',
    color: '#EA1F5A',
    iconSize: 24,
    iconFamily: 'MaterialIcons',
    iconName: 'accessibility'
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row'
    },
    iconContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelContainer:{
        flex: 3,
        justifyContent: 'center'
    },
    label:{
        fontSize: 16
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
})

export default connect(mapStateToProps)(IconButton);