import { createStore, combineReducers } from 'redux'
// import { loadState, saveState } from './localStorage'
// import { throttle } from '~/utils'
import userReducer from './reducers/user'
import userbaseReducer from './reducers/userbase'
import postsReducer from './reducers/posts'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'

const makeStore = (context) => {
  const isServer = typeof window === 'undefined'

  const reducer = (state, action) => {
    if (action.type === HYDRATE) {
      const nextState = {
        ...state, // use previous state
        ...action.payload, // apply delta from hydration
      }
      if (state.count) nextState.count = state.count // preserve count value on client side navigation
      return nextState
    } else {
      return combineReducers({
        user: userReducer,
        userbase: userbaseReducer,
        posts: postsReducer,
      })(state, action)
    }
  }

  const store = createStore(
    reducer,
    undefined,
    !isServer
      ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      : undefined
  )
  // store.subscribe(throttle(() => saveState(store.getState()), 1000))
  return store
}

// export default makeStore

export const wrapper = createWrapper(makeStore, { debug: true })
