import React from 'react';

import {
    StyleSheet,
    View,
    Dimensions
} from 'react-native';

import { Svg, Rect, Ellipse } from 'react-native-svg';
import Colae from './styles';

const { width, height } = Dimensions.get('window');

export default class Background extends React.Component {
    constructor(props){
        super(props);
        this.state={
            theme: Colae.lightTheme
        }
        this._getTheme = this._getTheme.bind(this);
    }

    componentDidMount(){
        this._getTheme();
    }

    async _getTheme(){
        let s = this.state;
        s.theme = await Colae.getColorTheme();
        this.setState(s);
    }

    render(){
        return (
            <View style={styles.container}>
                <Svg height={height} width={width} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Ellipse  cx="50%" cy="44%" rx="62.5%" ry="16.1%" fill={this.state.theme.main} />
                    <Rect y="34.35%" width="100%" height="65.65%" fill={this.state.theme.main} />
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