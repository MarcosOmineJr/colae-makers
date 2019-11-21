import React from 'react';

import { connect } from 'react-redux';

import {
    StyleSheet,
    View,
    Text,
    Dimensions
} from 'react-native';

import { shadow } from './styles';

const { width } = Dimensions.get('window');

class Card extends React.Component {

    _componentWidth = ((width*0.1027)*this.props.colSpan)+((width*0.055)*(this.props.colSpan-1));

    render(){
        if(!this.props.header){
            return (
                <View style={[styles.container, !this.props.noShadow?{...shadow }:{}, { width: this._componentWidth, backgroundColor: this.props.ColUITheme.background }, styles.headerCard, this.props.contentContainerStyle]}>
                    {this.props.children}
                </View>
            );
        } else {
            return (
                <View style={[styles.container, !this.props.noShadow?{...shadow }:{}, { width: this._componentWidth, backgroundColor: this.props.ColUITheme.background }, styles.noHeaderCard, this.props.contentContainerStyle]}>
                    <View style={styles.generalContainer}>
                        <View style={[styles.headerStyle, { backgroundColor: this.props.ColUITheme.main }, this.props.headerContainerStyle]}>
                            <Text style={[styles.headerTextStyle, this.props.headerTextStyle]}>
                                {this.props.headerText}
                            </Text>
                        </View>
                        <View style={[styles.bodyContainerStyle, this.props.bodyContainerStyle]}>
                            {this.props.children}
                        </View>
                    </View>
                </View>
            );
        }
    }
}

Card.defaultProps = {
    colSpan: 6,
    headerText: 'Insert Text'
}

const styles = StyleSheet.create({
    container:{
        borderRadius: 5,
        padding: width * 0.0694,
        alignItems: 'center',
        justifyContent: 'center'
    },
    generalContainer:{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerStyle:{
        width: '100%',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        alignItems: 'center',
        paddingHorizontal: (width*0.0694)+(width*0.05)+(width*0.0139),
        paddingVertical: 15,
        justifyContent: 'center'
    },
    headerTextStyle:{
        fontFamily: 'Roboto',
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    },
    bodyContainerStyle:{
        padding: width * 0.0694
    },

    //particular Styles:
    headerCard:{},
    noHeaderCard:{
        padding: 0
    }
});

const mapStateToProps = (state)=>{
    return {
        ColUITheme: state.themesReducer.ColUITheme
    };
}

const mapDispatchToProps = (dispatch)=>{
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Card);