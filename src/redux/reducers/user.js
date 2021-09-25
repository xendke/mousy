import {
  SIGN_IN,
  SIGN_OUT,
  SET_AUTH,
  SET_INFO,
  SET_LIKED_POSTS,
} from '../actions/user'

const defaultState = {
  isSignedIn: false,
  auth: null,
  info: {},
}

const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SIGN_OUT:
      return defaultState
    case SIGN_IN:
      return {
        ...state,
        isSignedIn: action.isSignedIn,
        auth: action.auth,
      }
    case SET_AUTH:
      return {
        ...state,
        auth: action.auth,
      }
    case SET_INFO:
      return {
        ...state,
        info: action.info,
      }
    case SET_LIKED_POSTS:
      return {
        ...state,
        info: { ...state.info, likedPosts: action.likedPosts },
      }
    default:
      return state
  }
}

export default userReducer
