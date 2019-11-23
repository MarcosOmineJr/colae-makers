import { combineReducers } from 'redux';

import userReducer from './userReducer';
import themesReducer from './themesReducer';
import managedEventsReducer from './managedEventsReducer';

export default combineReducers({
    userReducer,
    themesReducer,
    managedEventsReducer
});