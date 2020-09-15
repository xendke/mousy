import { createStore, combineReducers } from 'redux'
import { loadState, saveState } from './localStorage'
import { throttle } from '~/utils'
import userReducer from './reducers/user'
import userbaseReducer from './reducers/userbase'

const store = createStore(
  combineReducers({ user: userReducer, userbase: userbaseReducer }),
  loadState(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

store.subscribe(throttle(() => saveState(store.getState()), 1000))

export default store
