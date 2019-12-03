import React from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { Icon } from 'native-base';

class SecondaryCard extends React.Component {

    constructor(props){
        super(props);
        this._getHeight = this._getHeight.bind(this);
        this.buttonHeight = 100;
    }

    _getHeight(event){
        let { height } = event.nativeEvent.layout;
        this.buttonHeight = height;
    }

    render(){

        const { ColUITheme, children, addButton, contentContainerStyle, onPress } = this.props;

        if(addButton){
            return (
                <TouchableOpacity onLayout={this._getHeight} style={[styles.card, { borderWidth:1, borderColor: ColUITheme.main, alignItems: 'center', justifyContent: 'center', width: this.buttonHeight }, contentContainerStyle]} onPress={onPress}>
                    <Icon type='MaterialIcons' name='add' style={[styles.icon, { color: ColUITheme.main }]} />
                </TouchableOpacity>
            );
        } else {
            return (
                <View style={[styles.card, { backgroundColor: ColUITheme.main }, contentContainerStyle]}>
                    { children }
                </View>
            );
        }
    }
}

SecondaryCard.defaultProps = {
    addButton: true,
    onPress: ()=>{}
}

const styles = StyleSheet.create({
    card:{
        padding: 15,
        paddingTop: 10,
        borderRadius: 10
    },
    icon: {
        fontSize: 40
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
})

export default connect(mapStateToProps)(SecondaryCard);