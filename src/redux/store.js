import { createStore, combineReducers } from 'redux'
import { loadState, saveState } from './localStorage'
import { throttle } from '~/utils'
import userReducer from './reducers/user'
import userbaseReducer from './reducers/userbase'
import postsReducer from './reducers/posts'

const devtools =
  // window && window.__REDUX_DEVTOOLS_EXTENSION__
  //   ? window.__REDUX_DEVTOOLS_EXTENSION__()
  () => {}

const store = createStore(
  combineReducers({
    user: userReducer,
    userbase: userbaseReducer,
    posts: postsReducer,
  }),
  loadState(),
  devtools()
)

store.subscribe(throttle(() => saveState(store.getState()), 1000))

export default store
