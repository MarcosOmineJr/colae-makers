import React from 'react';
import { connect } from 'react-redux';
import { shadow } from './styles';
import { Icon } from 'native-base';
import {
    StyleSheet,
    Dimensions,
    View,
    Image,
    TouchableOpacity
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
            <TouchableOpacity style={[styles.container, { backgroundColor: ColUITheme.background, borderColor: ColUITheme.main }]} onPress={onPress} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {
                        this._renderIf(source == undefined,
                            <Icon type='MaterialIcons' name='add' style={[styles.icon, { color: ColUITheme.main }]} />
                        )
                    }
                    {
                        this._renderIf(source != undefined,
                            <Image source={source} style={styles.image} />
                        )
                    }
                </View>
            </TouchableOpacity>
        );
    }
}

ProfileImageInput.defaultProps = {
    onPress: ()=>{},
    source: undefined,
    edit: false
}

const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 80,
        borderWidth: 1
    },
    iconContainer:{
        position: 'absolute',
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    icon:{
        fontSize: 40
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
    },
    image:{
        width: 100,
        height: 80
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
});

export default connect(mapStateToProps)(ProfileImageInput);

/*
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
*/