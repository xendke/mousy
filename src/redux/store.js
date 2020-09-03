import { createStore, combineReducers } from 'redux'
import { loadState, saveState } from './localStorage'
import { throttle } from '../utils'
import userReducer from './reducers/user'
import otherUsersReducer from './reducers/otherUsers'

const store = createStore(
  combineReducers({ user: userReducer, otherUsers: otherUsersReducer }),
  loadState(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

store.subscribe(throttle(() => saveState(store.getState()), 1000))

export default store
