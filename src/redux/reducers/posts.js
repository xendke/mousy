import { SET_INTERESTS_POSTS, SET_OWN_POSTS } from '../actions/posts'
import { SIGN_OUT } from '../actions/user'

const defaultState = {
  fromInterests: [],
  fromSelf: [],
}

const postsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SIGN_OUT:
      return defaultState
    case SET_INTERESTS_POSTS:
      return {
        ...state,
        fromInterests: action.posts,
      }
    case SET_OWN_POSTS:
      return {
        ...state,
        fromSelf: action.posts,
      }
    default:
      return state
  }
}
export default postsReducer
