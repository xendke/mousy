import { SET_OTHERS_INFO } from '../actions/otherUsers'

const defaultState = {}

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_OTHERS_INFO:
      return {
        ...state,
        [action.userId]: action.info,
      }
    default:
      return state
  }
}
