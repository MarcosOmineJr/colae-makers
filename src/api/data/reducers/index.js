import { combineReducers } from 'redux';

import userReducer from './userReducer';
import themesReducer from './themesReducer';

export default combineReducers({
    userReducer,
    themesReducer
});