import React from 'react';

import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

//imports:
import Boot from './routes';
import { Store } from './api/data';

export default class App extends React.Component {
    render(){
        return (
            <Provider store={Store}>
                <Boot />
            </Provider>
        );
    }
}