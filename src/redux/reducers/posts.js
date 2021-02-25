import { SET_INTERESTS_POSTS, SET_OWN_POSTS } from '../actions/posts'

const defaultState = {
  fromInterests: [],
  fromSelf: [],
}

export default (state = defaultState, action) => {
  switch (action.type) {
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
