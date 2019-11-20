import React from 'react';

import {
    StyleSheet,
    Dimensions,
    Text,
    View
} from 'react-native';

import {
    Button,
    Header,
    Left,
    Body,
    Right,
    Icon
} from 'native-base';

import Colae, { shadow } from './styles';

const { height, width } = Dimensions.get('window');

export default class CustomHeader extends React.Component {

    constructor(props){
        super(props);
        this.state = {
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
        if(this.props.noAuth){
            return (
                <Header
                style={{ backgroundColor: this.state.theme.main, ...shadow }}
                iosBarStyle='light-content'
                androidStatusBarColor={this.state.theme.main}
                >
                    <Left style={styles.flex}>
                        <Button transparent onPress={()=>this.props.navigation.goBack(null)}>
                            <Icon type='MaterialIcons' name='chevron-left' style={{color: this.state.theme.background}} />
                        </Button>
                    </Left>
                    <Body style={[styles.flex, styles.body]}>
                        <Text style={[styles.title, { color: this.state.theme.background }]}>{this.props.title}</Text>
                    </Body>
                    <Right style={styles.flex}>
                    </Right>
                </Header>
            );
        } else {
            <Header
                style={{ backgroundColor: this.state.theme.main, ...shadow }}
                iosBarStyle='light-content'
                androidStatusBarColor={this.state.theme.main}
                >
                    <Left style={styles.flex}>
                        {this.props.renderLeft}
                    </Left>
                    <Body style={[styles.flex, styles.body]}>
                        <Text style={[styles.title, { color: this.state.theme.background }]}>{this.props.title}</Text>
                    </Body>
                    <Right style={styles.flex}>
                        {this.props.renderRight}
                    </Right>
                </Header>
        }
    }
}

CustomHeader.defaultProps = {
    title: 'título'
}

const styles = StyleSheet.create({
    flex:{
        flex: 1
    },
    body:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    title:{
        fontSize: 16,
        textTransform: 'capitalize',
        letterSpacing: 1
    }
});