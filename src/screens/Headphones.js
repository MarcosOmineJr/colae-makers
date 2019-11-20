import React from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';

import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

import ColaeAPI from '../api';

const {width, height} = Dimensions.get('window');


//Métodos próprios:
const LOGO_URI = 'https://images.roughtrade.com/sir_trevor_images/images/000/001/984/original/aiaiai_round_logo_black.png?1539263377';
const getImageURI = id => {
  return `https://aiaiai.dk/images/front/${id}_m.png`;
}

export default class ColaeApp extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      products: ColaeAPI.data.headphones
    }

    this._convert = this._convert.bind(this);
    this._renderItem = this._renderItem.bind(this);
  }

  _scrollX = new Animated.Value(0);

  async _convert(o){
    let s = this.state;
    if(typeof this.state.products[0].price == 'number'){
      for(let i = 0; i < s.products.length; i++){
        s.products[i].price = o + ' ' + await ColaeAPI.services.currency.convert(s.products[i].price, 'dkk', o);
      }
    }
    this.setState(s);
  }

  componentDidMount(){
    this._convert('BRL');
  }

  _renderItem = (item, i)=>{
    const inputRange = [
      (i-2) * width,
      (i-1) * width,
      i * width,
      (i+1) * width
    ];

    const imageScale = this._scrollX.interpolate({
      inputRange,
      outputRange: [1, .3, 1,.3]
    });

    const imageOpacity = this._scrollX.interpolate({
      inputRange,
      outputRange: [1, .1, 1, .1]
    });

    return (
      <View key={item.id} style={[styles.container, styles.item]}>
        {this._renderRadialGradient(item.bg, inputRange)}
        <Animated.Image source={{uri: getImageURI(item.id)}} style={[styles.image, {
          transform:[{
            scale: imageScale
          }],
          opacity: imageOpacity
        }]} />
        <Animated.View style={[styles.metaContainer, {
          opacity: imageOpacity
        }]}>
          <Text style={[styles.font, styles.title]}>{item.title}</Text>
          <Text style={[styles.font, styles.subtitle]}>{item.subtitle}</Text>
          <Text style={[styles.font, styles.description]}>{item.description}</Text>
          <Text style={[styles.font, styles.price]}>{item.price}</Text>
        </Animated.View>
      </View>
    );
  }

  _renderRadialGradient = (color, inputRange) => {
    const rotate = this._scrollX.interpolate({
      inputRange,
      outputRange: ['0deg', '15deg', '0deg', '-15deg']
    });
    const translateX = this._scrollX.interpolate({
      inputRange,
      outputRange: [0, width, 0, -width]
    });
    const opacity = this._scrollX.interpolate({
      inputRange,
      outputRange: [1, .5, 1, .5]
    });

    return (
    <Animated.View style={[styles.svgContainer, {
      transform: [{
        rotate
      }, {
        translateX
      }, {
        scale: 1.3
      }],
      opacity
    }]}>
      <Svg height={height} width={width} style={styles.bgRadialGradient}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="35%" r="60%" gradientUnits="userSpaceOnUse">
            <Stop
              offset="0%"
              stopColor="#FFFFFF"
              stopOpacity="1"
            />
            <Stop
              offset="100%"
              stopColor={color}
              stopOpacity="1"
            />
          </RadialGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill={`url(#grad)`}
          fillOpacity="0.9"
        />
      </Svg>
    </Animated.View>
    )
  }

  render(){
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          <StatusBar hidden />
          <Animated.ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          pagingEnabled
          scrollEventThrottle={16}
          horizontal
          onScroll={Animated.event([{nativeEvent: {contentOffset: {x: this._scrollX}}}],
          {useNativeDriver: true})}>
            {this.state.products.map((item, i) => this._renderItem(item, i))}
          </Animated.ScrollView>
          <Image source={{uri:LOGO_URI}} style={styles.logoImage} />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollViewContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  image:{
    width: width * .85,
    height: width * .85,
    resizeMode: 'contain'
  },
  metaContainer:{
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    padding: 10
  },
  title:{
    fontSize: 36,
    fontWeight: '900'
  },
  subtitle:{
    fontSize: 10,
    fontWeight: '900'
  },
  description:{
    fontSize: 14,
    marginVertical: 15,
    textAlign: 'center'
  },
  price:{
    fontSize: 42,
    fontWeight: '400'
  },
  font:{
    fontFamily: 'Menlo-Regular',
    color: '#222222'
  },
  svgContainer:{
    position: 'absolute',
    top: 0,
    left: 0
  },
  logoImage:{
    width: width/7,
    height: width/7,
    position: 'absolute',
    top: 10,
    resizeMode: 'contain'
  }
});