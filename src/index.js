import React from 'react';
import { PersistGate } from 'redux-persist/es/integration/react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

//imports:
import Boot from './routes';
import { store, persistor } from './api/data';

export default class App extends React.Component {
    render(){
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor} >
                    <Boot />
                </PersistGate>
            </Provider>
        );
    }
}