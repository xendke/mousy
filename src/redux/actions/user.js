export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'
export const SET_AUTH = 'SET_AUTH'
export const SET_INFO = 'SET_INFO'
export const SET_LIKED_POSTS = 'SET_LIKED_POSTS'

export function signIn(auth) {
  return {
    type: SIGN_IN,
    isSignedIn: true,
    auth,
  }
}
export function signOut() {
  return {
    type: SIGN_OUT,
    isSignedIn: false,
    auth: null,
  }
}
export function setAuth(auth) {
  return {
    type: SET_AUTH,
    auth,
  }
}
export function setInfo(info) {
  return {
    type: SET_INFO,
    info,
  }
}
export function setLikedPosts(likedPosts) {
  return {
    type: SET_LIKED_POSTS,
    likedPosts,
  }
}
