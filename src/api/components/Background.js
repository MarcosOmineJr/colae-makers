import React from 'react';

import { connect } from 'react-redux';

import {
    StyleSheet,
    View,
    Dimensions
} from 'react-native';

import { Svg, Rect, Ellipse } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

class Background extends React.Component {

    render(){
        return (
            <View style={styles.container}>
                <Svg height={height} width={width} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Ellipse  cx="50%" cy="44%" rx="62.5%" ry="16.1%" fill={this.props.ColUITheme.main} />
                    <Rect y="34.35%" width="100%" height="65.65%" fill={this.props.ColUITheme.main} />
                </Svg>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center'
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

export default connect(mapStateToProps, mapDispatchToProps)(Background);