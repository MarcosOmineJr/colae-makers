import React from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Dimensions,
    View,
    ScrollView,
    Image,
    Text
} from 'react-native';

const { width, height } = Dimensions.get('screen');

class EventImageSlider extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            selectedIndex: 0
        }

        this._setSelectedIndex = this._setSelectedIndex.bind(this);
    }

    _setSelectedIndex(event){
        //pegar o width da viewSize e a posição atual do ScrollView:
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        const contentOffset = event.nativeEvent.contentOffset.x;

        //Calcular a página atual:
        const selectedIndex = Math.ceil(contentOffset / viewSize);

        //Seta selectedIndex no state:
        let s = this.state;
        s.selectedIndex = selectedIndex;
        this.setState(s);
    }

    render(){

        const { photos, ColUITheme } = this.props;
        const { selectedIndex } = this.state;
        console.log('chamou render');
        console.log('com as fotos: ', photos);

        return (
            <View style={styles.container}>
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={this._setSelectedIndex}>
                    {
                        photos.map((uri, key)=>(
                            <Image key={key.toString()} source={{uri: uri}} style={styles.image} />
                        ))
                    }
                </ScrollView>
                <View style={styles.pageIndicator}>
                    {photos.map((data, key)=>(
                        <View key={key.toString()} style={[styles.whiteCircle, { backgroundColor: key === selectedIndex ? ColUITheme.accent : '#ccc' }]} />
                    ))}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'rgba(0,0,0,0.5)',
        width,
        height: height*0.275
    },
    image:{
        width,
        height: height*0.275
    },   
    pageIndicator:{
        position: 'absolute',
        bottom: '5%',
        height: 10,
        width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    whiteCircle:{
        width: 8,
        height: 8,
        borderRadius: 4,
        margin: 5,
        backgroundColor: '#fff'
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
})

export default connect(mapStateToProps)(EventImageSlider);