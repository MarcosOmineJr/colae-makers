import React from 'react';
import { connect } from 'react-redux';
import { shadow } from './styles';
import { Icon } from 'native-base';
import {
    StyleSheet,
    Dimensions,
    View,
    Image,
    TouchableHighlight
} from 'react-native';

const { height, width } = Dimensions.get('screen');

class ProfileImageInput extends React.Component {

    _renderIf(condition, component){
        if(condition){
            return (
                component
            );
        }
    }

    render(){

        const { ColUITheme, onPress, source, edit } = this.props;

        return (
            <TouchableHighlight style={[styles.round, shadow, { backgroundColor: ColUITheme.background }]} onPress={onPress} >
                <View style={{ flex: 1 }}>
                    {
                        this._renderIf(edit,
                            <View style={{ flex: 1 }}>
                                {
                                    this._renderIf(source != undefined, 
                                        <View style={[styles.round, styles.withImage]}>
                                            <Image source={source} style={styles.round} />
                                            <View style={[styles.round, styles.overlay]} />
                                        </View>
                                    )
                                }
                                <View style={[styles.round, styles.iconContainer]}>
                                    <Icon type='MaterialIcons' name='add' style={[styles.icon, { color: ColUITheme.main }]} />
                                </View>
                            </View>
                        )
                    }
                    {
                        this._renderIf(!edit,
                            <View style={{ flex: 1 }}>
                                {
                                    this._renderIf(source == undefined,
                                        <View style={[styles.round, styles.iconContainer]}>
                                            <Icon type='MaterialIcons' name='add' style={[styles.icon, { color: ColUITheme.main }]} />
                                        </View>
                                    )
                                }
                                {
                                    this._renderIf(source != undefined, 
                                        <View style={[styles.round, styles.withImage]}>
                                            <Image source={source} style={styles.round} />
                                        </View>
                                    )
                                }
                            </View>
                        )
                    }
                </View>
            </TouchableHighlight>
        );
    }
}

ProfileImageInput.defaultProps = {
    onPress: ()=>{},
    source: undefined,
    edit: false
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

export default connect(mapStateToProps)(ProfileImageInput);