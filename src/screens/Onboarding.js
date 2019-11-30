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
    {image: 'https://images.unsplash.com/photo-1575081151297-19c23575e91b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=800',
    title: 'Encontre eventos próximos a você', description: 'Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy'},
    {image: 'https://images.unsplash.com/photo-1531168556467-80aace0d0144?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
    title: 'Onboarding 2', description: 'Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy'},
    {image: 'https://images.unsplash.com/photo-1484968309888-8d6b403bc1ec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
    title: 'Onboarding 3', description: 'Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy'},
    {image: 'https://images.unsplash.com/photo-1485601284679-a2f86e6f7dea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
    title: 'Onboarding 4', description: 'Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy'}
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
                        <ColUI.Button colSpan={4} label='CADASTRE-SE' onPress={()=>navigation.navigate('Login')} />
                        <ColUI.Button contentContainerStyle={{ backgroundColor: ColUITheme.purple.light }} colSpan={4} label='JÁ TENHO UMA CONTA' onPress={()=>navigation.navigate('SignUp')} />
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