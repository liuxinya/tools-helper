import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {userInfoReducer} from './userStore';

const rootReducer = combineReducers({
    user: userInfoReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
