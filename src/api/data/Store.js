import { createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import Reducers from './reducers';

const persistedReducer = persistReducer({
    key:'root',
    storage: AsyncStorage,
    whitelist: ['userReducer', 'themesReducer', 'managedReducer'],
    //blacklist: []
}, Reducers);

const store = createStore(persistedReducer);

let persistor = persistStore(store);

export { store, persistor };