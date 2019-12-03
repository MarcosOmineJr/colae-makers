import React from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Dimensions,
    View,
    Text
} from 'react-native';
import { Icon } from 'native-base';

class EventGlobalRating extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            startype: ['empty','empty','empty','empty','empty']
        }

        this._renderStar = this._renderStar.bind(this);
    }

    componentDidMount(){
        let s = this.state;
        const { rating } = this.props;
        const integer = Math.trunc(rating);
        const half = rating - integer;
        let index = 0;
        while(index < integer){
            s.startype[index] = 'full',
            index++;
        }
        if(half){
            s.startype[index] = 'half'
        }

        this.setState(s);
    }

    _renderStar(type){

        const { lightContent, ColUITheme } = this.props;

        switch(type){
            case 'empty':
                return <Icon type='MaterialIcons' name='star-border' style={[styles.icon, { color: lightContent ? ColUITheme.background : '#F5E342' }]} />
                break;
            case 'full':
                return <Icon type='MaterialIcons' name='star' style={[styles.icon, { color: lightContent ? ColUITheme.background : '#F5E342' }]} />
                break;
            case 'half':
                return <Icon type='MaterialIcons' name='star-half' style={[styles.icon, { color: lightContent ? ColUITheme.background : '#F5E342' }]} />
                break;
        }
    }

    render(){

        const { avaliationCount, lightContent, ColUITheme, style } = this.props;
        const { startype } = this.state;

        return (
            <View style={[styles.container, style]}>
                {this._renderStar(startype[0])}
                {this._renderStar(startype[1])}
                {this._renderStar(startype[2])}
                {this._renderStar(startype[3])}
                {this._renderStar(startype[4])}
                <Text style={[styles.avalCount, { color: lightContent ? '#fff' : ColUITheme.gray.light }]}>({avaliationCount})</Text>
            </View>
        );
    }
}

EventGlobalRating.defaultProps = {
    lightContent: true,
    rating: 0,
    avaliationCount: 0
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    icon:{
        fontSize: 18,
        color: '#F5E342'
    },
    avalCount:{
        marginLeft: 8,
        fontStyle: 'italic'
    }
});

const mapStateToProps = (state)=>({
    ColUITheme: state.themesReducer.ColUITheme
});

export default connect(mapStateToProps)(EventGlobalRating);