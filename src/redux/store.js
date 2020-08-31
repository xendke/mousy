import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/user';
import otherUsersReducer from './reducers/otherUsers';

export default createStore(
	combineReducers({ user: userReducer, otherUsers: otherUsersReducer }),
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
