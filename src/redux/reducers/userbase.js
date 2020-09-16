import { SET_USERBASE_INFO } from '../actions/userbase'
import { SIGN_OUT } from '../actions/user'

const defaultState = {}

export default (state = defaultState, action) => {
  switch (action.type) {
    case SIGN_OUT:
      return defaultState
    case SET_USERBASE_INFO:
      return {
        ...state,
        [action.userId]: action.info,
      }
    default:
      return state
  }
}
