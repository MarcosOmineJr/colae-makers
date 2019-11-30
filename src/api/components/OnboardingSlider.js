import React from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Image,
    View,
    Text
} from 'react-native';

const { height, width } = Dimensions.get('window');

class OnboardingSlider extends React.Component {

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

        //Desestruturando props e state pra ficar mais fácil e limpo de usar depois...muito experto!
        const { images, ColUITheme } = this.props;
        const { selectedIndex } = this.state;

        return (
            <SafeAreaView>
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={this._setSelectedIndex}>
                    {images.map(data=>(
                        <View key={data.image} style={styles.onboardingImageContainer}>
                            <Image source={{uri:data.image}} style={styles.image} resizeMode='contain' />
                            <Text style={[styles.title, { color: ColUITheme.accent }]}>{data.title}</Text>
                            <Text style={styles.description}>{data.description}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.pageIndicator}>
                    {images.map((data, i)=>(
                        <View key={data.image} style={[styles.whiteCircle, { backgroundColor: i === selectedIndex ? ColUITheme.accent : '#ccc' }]} />
                    ))}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    onboardingImageContainer:{
        flex: 1,
        width,
        alignItems: 'center',
        justifyContent: 'center'
    },image:{
        height: '50%',
        width: '80%'
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
        width: 7,
        height: 7,
        borderRadius: 3.5,
        margin: 5,
        backgroundColor: '#fff'
    },
    title:{
        marginVertical:'5%',
        fontSize: 18
    },
    description:{
        textAlign: 'center',
        color: '#999',
        width: '70%',
        fontSize: 16
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
})

export default connect(mapStateToProps)(OnboardingSlider);