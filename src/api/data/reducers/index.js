import { combineReducers } from 'redux';

import userReducer from './userReducer';
import themesReducer from './themesReducer';
import publishedEventsReducer from './publishedEventsReducer';
import draftsReducer from './draftsReducer';

export default combineReducers({
    userReducer,
    themesReducer,
    publishedEventsReducer,
    draftsReducer
});