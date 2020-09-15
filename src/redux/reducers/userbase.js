import { SET_USERBASE_INFO } from '../actions/userbase'

const defaultState = {}

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_USERBASE_INFO:
      return {
        ...state,
        [action.userId]: action.info,
      }
    default:
      return state
  }
}
