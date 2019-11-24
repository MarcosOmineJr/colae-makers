import React from 'react';

import { connect } from 'react-redux';

import {
    StyleSheet,
    Text
} from 'react-native';

import {
    Button,
    Header,
    Left,
    Body,
    Right,
    Icon
} from 'native-base';

import { shadow } from './styles';

class CustomHeader extends React.Component {

    render(){
        if(this.props.noAuth){
            return (
                <Header
                style={{ backgroundColor: this.props.ColUITheme.main, ...shadow }}
                iosBarStyle='light-content'
                androidStatusBarColor={this.props.ColUITheme.main}
                >
                    <Left style={styles.flex}>
                        <Button transparent onPress={()=>this.props.navigation.goBack(null)}>
                            <Icon type='MaterialIcons' name='chevron-left' style={{color: this.props.ColUITheme.background}} />
                        </Button>
                    </Left>
                    <Body style={[{ flex: 2 }, styles.body]}>
                        <Text style={[styles.title, { color: this.props.ColUITheme.background }]}>{this.props.title}</Text>
                    </Body>
                    <Right style={styles.flex}>
                    </Right>
                </Header>
            );
        } else {

            return (
                <Header
                style={{ backgroundColor: this.props.ColUITheme.main, ...shadow }}
                iosBarStyle='light-content'
                androidStatusBarColor={this.props.ColUITheme.main}
                >
                    <Left style={styles.flex}>
                        {this.props.renderLeft}
                    </Left>
                    <Body style={[{ flex: 2 }, styles.body]}>
                        <Text style={[styles.title, { color: this.props.ColUITheme.background }]}>{this.props.title}</Text>
                    </Body>
                    <Right style={styles.flex}>
                        {this.props.renderRight}
                    </Right>
                </Header>
            );
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
        letterSpacing: 1
    }
});

const mapStateToProps = (state)=>{
    return {
        ColUITheme: state.themesReducer.ColUITheme
    };
}

export default connect(mapStateToProps)(CustomHeader);