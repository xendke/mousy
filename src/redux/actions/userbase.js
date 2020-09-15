export const SET_USERBASE_INFO = 'SET_USERBASE_INFO'

export function setUserbaseInfo(userId, info) {
  return {
    type: SET_USERBASE_INFO,
    userId,
    info,
  }
}
