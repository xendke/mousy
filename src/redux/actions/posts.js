export const SET_INTERESTS_POSTS = 'SET_INTERESTS_POSTS'
export const SET_OWN_POSTS = 'SET_OWN_POSTS'

export function setInterestsPosts(posts) {
  return {
    type: SET_INTERESTS_POSTS,
    posts,
  }
}

export function setOwnPosts(posts) {
  return {
    type: SET_OWN_POSTS,
    posts,
  }
}
