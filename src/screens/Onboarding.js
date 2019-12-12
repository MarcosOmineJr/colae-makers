import React from 'react';
import { connect } from 'react-redux';
import {
    SafeAreaView,
    View,
    Text,
    Dimensions,
    StyleSheet,
    StatusBar,
    Linking
} from 'react-native';
import {
    Header, Col
} from 'native-base';

import ColaeAPI from '../api';

const { ColUI } = ColaeAPI;
const { width, height } = Dimensions.get('window');

const onboardingData = [
    {image: 'https://firebasestorage.googleapis.com/v0/b/colae-makers.appspot.com/o/onboarding%2Fencontre_onboarding.png?alt=media&token=82235ce3-bd96-44ac-b7ae-fef3cb576174',
    title: 'Encontre eventos próximos de você', description: ''},
    {image: 'https://firebasestorage.googleapis.com/v0/b/colae-makers.appspot.com/o/onboarding%2Favalie_onboarding.png?alt=media&token=9e46dfd5-a60c-4628-8596-167ab0a17916',
    title: 'Avalie, comente e interaja', description: ''},
    {image: 'https://firebasestorage.googleapis.com/v0/b/colae-makers.appspot.com/o/onboarding%2Fconecte_onboarding.png?alt=media&token=61881920-c5c9-46e4-aa66-846ae62d42c8',
    title: 'Conecte-se com os amigos', description: ''},
    {image: 'https://firebasestorage.googleapis.com/v0/b/colae-makers.appspot.com/o/onboarding%2Facompanhe_onboarding.png?alt=media&token=72c4baf8-017a-4501-873a-2728f65d24c6',
    title: 'Acompanhe eventos de seu interesse', description: ''}
]

class Onboarding extends React.Component {

    render(){
        const { ColUITheme, navigation } = this.props;

        return (
            <View style={[styles.container, { backgroundColor: ColUITheme.background }]}>
                <Header noShadow androidStatusBarColor={this.props.ColUITheme.background} style={{ backgroundColor:'transparent' }} />
                <StatusBar barStyle={ ColUITheme.background === '#FFFFFF' ? 'dark-content' : 'light-content'} />
                <SafeAreaView style={styles.onboardingContainer}>
                    <ColUI.OnboardingSlider images={onboardingData} />
                </SafeAreaView>
                <View style={styles.buttonsContainer}>
                    <View style={styles.buttons}>
                        <ColUI.Button colSpan={4} label='CADASTRE-SE' onPress={()=>navigation.navigate('SignUp')} />
                        <ColUI.Button contentContainerStyle={{ backgroundColor: ColUITheme.purple.light }} colSpan={4} label='JÁ TENHO UMA CONTA' onPress={()=>navigation.navigate('Login')} />
                    </View>
                    <View style={styles.support}>
                        <Text style={styles.calling}>Precisa de ajuda?</Text>
                        <Text style={[styles.email, { color: ColUITheme.main }]} onPress={()=>{Linking.openURL('mailto:suporte@colaeapp.com?subject='+ encodeURI('Help Colaê! Preciso de ajuda'))}}>suporte@colaeapp.com</Text>
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
    itemContainerStyle:{
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center'
    },
    onboardingContainer:{
        flex: 2.5
    },
    buttonsContainer:{
        flex: 1,
        width
    },
    buttons:{
        flex: 2,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    support:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    calling:{
        color: '#999'
    },
    email:{
        textDecorationLine: 'underline'
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
});

const mapDispatchtoProps = (dispatch)=>({
    setLightTheme: () => {dispatch({type: 'LIGHT_MODE'})},
    setDarkTheme: () => {dispatch({type: 'DARK_MODE'})}
});

export default connect(mapStateToProps, mapDispatchtoProps)(Onboarding);

/*
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
*/

/*
<Header noShadow androidStatusBarColor={this.props.ColUITheme.background} style={{ backgroundColor:'transparent' }} />
<StatusBar barStyle='dark-content' />
<ColUI.OnboardingSlider images={testImages} />
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
*/