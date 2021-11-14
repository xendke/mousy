// import React, { useEffect } from 'react'
import xs, { Stream } from 'xstream'
import { withEffects, toProps } from 'refract-xstream'
import { connect } from 'react-redux'
import { compose } from '~/utils'
// import { setInfo } from '~/redux/actions/user'
import { withFirebase } from '~/components/firebase'

import { User } from '~/types'

import ProfileView from './ProfileView'

const UserProfile = (props) => {
  return <ProfileView {...props} />
}

const aperture = (component, { firebase, userId }) => {
  const userAuth = (): Stream<User> =>
    component
      .observe('user')
      .filter(({ auth, info }) => auth && info)
      .take(1)

  const loadOtherUserInfo$ = userAuth()
    .map(() =>
      xs.fromPromise(
        firebase
          .doUserInfoGet(userId)
          .then((res) => res.data() || { userNotAvailable: true })
          .catch(() => ({ error: true }))
      )
    )
    .flatten()
    .map((userData) => ({ userData, userId }))

  const loadPosts$ = userAuth()
    .debug('loadPosts$ likes')
    .map(() => xs.fromPromise(firebase.doUserPostsGet(userId)))
    .flatten()
    .map((posts) => {
      return { loadingPosts: false, posts, showingLikes: false }
    })

  return xs
    .merge(
      loadOtherUserInfo$,
      loadPosts$,
      component.mount.mapTo({
        loadingPosts: true,
      })
    )
    .startWith({ posts: [], loadingPosts: true, isOwnProfile: false })
    .map(toProps)
}

const mapStateToProps = (state) => ({
  user: state.user,
  userbase: state.userbase,
})

export default compose(
  connect(mapStateToProps),
  withFirebase,
  withEffects(aperture, {
    mergeProps: true,
    errorHandler: () => (e) => console.log(e),
  })
)(UserProfile)
