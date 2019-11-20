import React from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Animated,
    StatusBar,
    Linking
} from 'react-native';
import {
    Header
} from 'native-base';

import { Svg, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;
const { width, height } = Dimensions.get('window');

export default class AuthCheck extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            onboardingData: ['Onboarding 1', 'Onboarding 2', 'Onboarding 3', 'Onboarding 4', 'Onboarding 5'],
            theme: ColaeAPI.ColUI.styles.lightTheme
        }
        this._renderItem = this._renderItem.bind(this);
        this._getTheme = this._getTheme.bind(this);
    }
    
    _scrollX = new Animated.Value(0);

    componentDidMount(){
        this._getTheme;
    }

    _renderItem(item, i){
        return (
            <View style={styles.itemContainerStyle} key={i}>
                <Text style={{fontSize: 30, color: this.state.theme.accent}} onPress={()=>{Linking.openURL('https://google.com.br')}}>{item}</Text>
            </View>
        );
    }

    async _getTheme(){
        let s = this.state;
        s.theme = await ColaeAPI.ColUI.styles.getColorTheme();
        this.setState(s);
    }

    render(){
        return (
            <View style={styles.container}>
                <Header noShadow androidStatusBarColor={this.state.theme.background} style={{ backgroundColor:'transparent' }} />
                <StatusBar barStyle='dark-content' />
                <Animated.ScrollView
                contentContainerStyle={styles.onboardingContainer}
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event([{nativeEvent: {contentOffset: {x: this._scrollX}}}],
                {useNativeDriver: true})}
                >
                    {this.state.onboardingData.map((item, i)=>this._renderItem(item, i))}
                </Animated.ScrollView>
                <View style={styles.buttonsSectionContainer}>
                    <Svg height="100%" width="100%" style={styles.svgBG}>
                        <Defs>
                            <LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="100%">
                                <Stop offset="0" stopColor="#6500FF" stopOpacity="1" />
                                <Stop offset="1" stopColor="#1F0555" stopOpacity="1" />
                            </LinearGradient>
                        </Defs>
                        <Rect fill="url(#grad)" x="0" y="0" strokeWidth="0" stroke="transparent" width="100%" height="100%" />
                    </Svg>
                    <View style={styles.buttonsContainer}>
                        <ColUI.Button blue label="login" navigation={this.props.navigation} onPress={()=>this.props.navigation.navigate('Login')} />
                        <ColUI.Button blue label="cadastro" navigation={this.props.navigation} onPress={()=>this.props.navigation.navigate('SignUp')} />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    onboardingContainer:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemContainerStyle:{
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonsSectionContainer:{
        width: '100%',
        height: '12.5%',
        backgroundColor: '#10ffff'
    },
    svgBG:{
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    buttonsContainer:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    }
});