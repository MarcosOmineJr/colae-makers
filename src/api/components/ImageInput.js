import React from 'react';
import { connect } from 'react-redux';
import { shadow } from './styles/';
import { Icon } from 'native-base';
import {
    StyleSheet,
    Dimensions,
    View,
    Image,
    TouchableHighlight
} from 'react-native';

const { height, width } = Dimensions.get('screen');

const testURI = 'https://observatoriodocinema.bol.uol.com.br/wp-content/uploads/2019/07/cropped-keanu-reeves-1-4.jpg'

class ImageInput extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            imageURI: ''
        }

        this._toggleKeanu = this._toggleKeanu.bind(this);
    }

    _renderIf(condition, component){
        if(condition){
            return (
                component
            );
        }
    }

    _toggleKeanu(){
        let s = this.state;
        if(s.imageURI == ''){
            s.imageURI = testURI;
        } else {
            s.imageURI = '';
        }
        this.setState(s);
    }

    render(){

        const { ColUITheme } = this.props;
        const { imageURI } = this.state;

        return (
            <TouchableHighlight style={[styles.round, shadow, { backgroundColor: ColUITheme.background }]} onPress={this._toggleKeanu} >
                <View style={{ flex: 1 }}>
                    { this._renderIf(imageURI != '', 
                        <View style={[styles.round, styles.withImage]}>
                            <Image source={{uri: imageURI}} style={styles.round} />
                            <View style={[styles.round, styles.overlay]} />
                        </View>
                    ) }
                    <View style={[styles.round, styles.iconContainer]}>
                        <Icon type='MaterialIcons' name='add' style={[styles.icon, { color: ColUITheme.main }]} />
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    iconContainer:{
        position: 'absolute',
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    icon:{
        fontSize: 35
    },
    round:{
        width: 100,
        height: 100,
        borderRadius: 50
    },
    overlay:{
        backgroundColor: 'rgba(0,0,0,0.3)',
        position: 'absolute',
        top: 0,
        left: 0
    },
    withImage:{
        position: 'absolute',
        top: 0,
        left: 0
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
});

export default connect(mapStateToProps)(ImageInput);