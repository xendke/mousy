import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import { withEffects, toProps } from 'refract-xstream'
import { connect } from 'react-redux'
import { compose } from '~/utils'
import { Post, Loading, Avatar, Empty } from '~/components'
import { Action } from '~/components/Empty/Empty'
import { withFirebase } from '~/components/firebase'

import './Profile.scss'

const shouldRedirectToLogin = (auth, userData = {}) => !auth || userData.error

const Profile = ({
  user,
  isOwnProfile,
  userId,
  userData,
  posts,
  loadingPosts,
}) => {
  if (shouldRedirectToLogin(user.auth, userData)) {
    return <Redirect to="/login" />
  }

  if (!user.auth || !userData) {
    return <Loading />
  }

  const postsComponents = posts.map(({ id, content, createdAt, likeCount }) => (
    <Post
      key={id}
      postId={id}
      userFullName={userData.name}
      username={userData.username}
      content={content}
      createdAt={createdAt}
      likeCount={likeCount}
    />
  ))

  const getContent = () => {
    if (loadingPosts) return <Loading />
    if (postsComponents.length > 0) return postsComponents
    const emptyActions = [<Action key="Feed" link="/" label="Feed" />]
    return (
      <Empty
        message="No posts yet. Try heading to the Feed to post your thoughts!"
        actions={emptyActions}
      />
    )
  }

  return (
    <section className="Profile container columns is-desktop">
      <div className="column is-one-quarter-desktop user-info">
        <div className="level">
          <div className="level-item">
            <figure className="image is-64x64">
              <Avatar userId={userId} />
            </figure>
          </div>
        </div>
        <h1 className="title has-text-centered is-capitalized">
          {userData.name}
        </h1>
        <h2 className="subtitle has-text-centered">
          # {userData.interests.join(', ')}
        </h2>
        {isOwnProfile && (
          <Link to="/account">
            <button
              type="button"
              className="button is-small is-primary is-inverted is-outlined"
            >
              <span className="icon is-small">
                <i className="fas fa-cog" />
              </span>
              <span>Edit</span>
            </button>
          </Link>
        )}
      </div>

      <div className="column">{getContent()}</div>
    </section>
  )
}

const aperture = (component, { firebase, user }) => {
  const userIdParam = () =>
    component.observe('match', ({ params }) => params.userId)

  const loadOtherUserInfo$ = userIdParam()
    .filter((param) => param)
    .map((userId) =>
      xs.fromPromise(
        firebase
          .doUserInfoGet(userId)
          .then((res) => res.data())
          .catch(() => ({ error: true }))
      )
    )
    .flatten()
    .compose(
      sampleCombine(component.observe('match', ({ params }) => params.userId))
    )
    .map(([userData, userId]) => ({ userData, isOwnProfile: false, userId }))

  const useOwnUserInfo$ = userIdParam()
    .filter((param) => !param)
    .mapTo({
      userData: user.info,
      isOwnProfile: true,
      userId: user.auth && user.auth.uid,
    })

  const loadPosts$ = userIdParam()
    .map((param) => param || user.auth.uid)
    .map((userId) => xs.fromPromise(firebase.doUserPostsGet(userId)))
    .flatten()
    .debug('posts')
    .map((posts) => {
      return { loadingPosts: false, posts }
    })

  return xs
    .merge(useOwnUserInfo$, loadOtherUserInfo$, loadPosts$)
    .startWith({ posts: [], loadingPosts: true })
    .map(toProps)
}

export default compose(
  connect((state) => ({ user: state.user })),
  withFirebase,
  withEffects(aperture, { mergeProps: true })
)(Profile)
