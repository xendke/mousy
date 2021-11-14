// import React, { useEffect } from 'react'
import xs, { Stream } from 'xstream'
import { withRouter } from 'next/router'
import sampleCombine from 'xstream/extra/sampleCombine'
import { withEffects, toProps } from 'refract-xstream'
import { connect } from 'react-redux'
import { compose } from '~/utils'
import { setInfo } from '~/redux/actions/user'
import { withFirebase } from '~/components/firebase'

import { User } from '~/types'
import ProfileView from './ProfileView'

const OwnProfile = (props) => {
  return <ProfileView {...props} />
}

const aperture = (component, { firebase, dispatch }) => {
  const [showLikes$, showLikes] = component.useEvent(false)

  const userAuth = (): Stream<User> =>
    component
      .observe('user')
      .filter(({ auth, isSignedIn }) => auth && isSignedIn)
      .debug('USER AUTH')
      .take(1)

  const userInfo$ = component
    .observe('user')
    .filter(({ info }) => info.likedPosts)
    .debug('USER INFO')
    .take(1)

  const useOwnUserInfo$ = userAuth()
    .filter((user) => Boolean(user.info?.name))
    .map((user) => ({
      userData: user.info,
      isOwnProfile: true,
      userId: user.auth.uid,
    }))

  const loadOwnUserInfo$ = userAuth()
    .filter((user) => !user.info?.name)
    .map((user) =>
      xs.fromPromise(
        firebase
          .doUserInfoGet(user.auth.uid)
          .then((res) => [res.data(), user.auth.uid])
          .catch(() => ({ error: true }))
      )
    )
    .flatten()
    .map(([userData, userId]) => {
      if (!userData.error) {
        dispatch(setInfo(userData))
      }
      return [userData, userId]
    })
    .map(([userData, userId]) => ({
      userData,
      userId,
    }))

  const loadPosts$ = xs
    .combine(userInfo$, showLikes$)
    .debug('LOAD POSTS')
    .map(([user, fetchLikedPosts]: [User, boolean]) => [
      fetchLikedPosts,
      user.auth.uid,
      user.info.likedPosts,
    ])
    .map(([fetchLikedPosts, userId, likedPosts]) =>
      fetchLikedPosts
        ? xs.fromPromise(firebase.doLikedPostsGet(likedPosts))
        : xs.fromPromise(firebase.doUserPostsGet(userId))
    )
    .flatten()
    .compose(sampleCombine(showLikes$))
    .map(([posts, showingLikes]) => {
      return { loadingPosts: false, posts, showingLikes }
    })

  return xs
    .merge(
      useOwnUserInfo$,
      loadOwnUserInfo$,
      loadPosts$,
      showLikes$.map((showingLikes) => ({
        showingLikes,
        showLikes,
        loadingPosts: true,
      }))
    )
    .startWith({ posts: [], loadingPosts: true, isOwnProfile: true })
    .map(toProps)
}

const mapStateToProps = (state) => ({
  user: state.user,
  userbase: state.userbase,
})

export default compose(
  connect(mapStateToProps),
  withRouter,
  withFirebase,
  withEffects(aperture, {
    mergeProps: true,
    errorHandler: () => (e) => console.log(e),
  })
)(OwnProfile)
