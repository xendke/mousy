import React from 'react'
import xs from 'xstream'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faHeart, faCog } from '@fortawesome/free-solid-svg-icons'
import sampleCombine from 'xstream/extra/sampleCombine'
import { withEffects, toProps } from 'refract-xstream'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from '~/utils'
import { setInfo } from '~/redux/actions/user'
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
  userbase,
  posts,
  loadingPosts,
  showingLikes,
  showLikes,
}) => {
  if (shouldRedirectToLogin(user.auth, userData)) {
    return <Redirect to="/login" />
  }

  if (!user.auth || !userData) {
    return <Loading />
  }

  const likedPosts = userData.likedPosts ? userData.likedPosts : []

  const postsComponents = posts.map(
    ({ id, content, createdAt, likeCount, userId: authorId }) => {
      const { userNotAvailable } = userData
      const author = userNotAvailable
        ? { name: 'Deleted', username: 'deleted' }
        : userbase[authorId] || userData
      return (
        <Post
          key={id}
          postId={id}
          userFullName={author.name}
          username={author.username}
          content={content}
          createdAt={createdAt}
          likeCount={likeCount}
          liked={likedPosts.includes(id)}
        />
      )
    }
  )

  const getContent = () => {
    if (loadingPosts) return <Loading />
    if (postsComponents.length > 0) return postsComponents
    const emptyActions = [<Action key="Feed" link="/" label="Feed" />]
    const message = showingLikes
      ? 'No posts here. Try heading to the Feed to like some posts!'
      : 'No posts yet. Try heading to the Feed to post your thoughts!'
    return <Empty message={message} actions={emptyActions} />
  }

  const { userNotAvailable, name, interests } = userData

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
          {userNotAvailable ? 'Deleted User' : name}
        </h1>
        <h2 className="subtitle has-text-centered">
          {interests && interests.length > 0
            ? `# ${interests.join(', ')}`
            : null}
        </h2>
        {isOwnProfile && (
          <>
            <Link to="/account">
              <button
                type="button"
                className="button is-small is-primary is-inverted is-outlined"
              >
                <span className="icon is-small">
                  <FontAwesomeIcon icon={faCog} />
                </span>
                <span>Edit</span>
              </button>
            </Link>

            <div className="box">
              <div className="buttons has-addons is-centered is-expanded">
                <button
                  type="button"
                  className={`button ${
                    !showingLikes ? 'is-primary is-selected' : ''
                  }`}
                  onClick={() => showLikes(false)}
                >
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faComment} />
                  </span>
                  <span>Posts</span>
                </button>
                <button
                  type="button"
                  className={`button ${
                    showingLikes ? 'is-primary is-selected' : ''
                  }`}
                  onClick={() => showLikes(true)}
                >
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faHeart} />
                  </span>
                  <span>Likes</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="column">{getContent()}</div>
    </section>
  )
}

const aperture = (component, { firebase, user, dispatch }) => {
  const [showLikes$, showLikes] = component.useEvent(false)
  const userIdParam = () =>
    component.observe('match', ({ params }) => params.userId)

  const likedPosts = user.info?.likedPosts || []

  const loadOtherUserInfo$ = userIdParam()
    .filter((param) => param)
    .map((userId) =>
      xs.fromPromise(
        firebase
          .doUserInfoGet(userId)
          .then((res) => res.data() || { userNotAvailable: true })
          .catch(() => ({ error: true }))
      )
    )
    .debug()
    .flatten()
    .debug('flat')
    .compose(sampleCombine(userIdParam()))
    .debug('info')
    .map(([userData, userId]) => ({ userData, isOwnProfile: false, userId }))

  const useOwnUserInfo$ = userIdParam()
    .filter((param) => !param && user.info && user.info.name)
    .mapTo({
      userData: user.info,
      isOwnProfile: true,
      userId: user.auth?.uid,
    })

  const loadOwnUserInfo$ = userIdParam()
    .filter((param) => !param && user.info && !user.info.name)
    .map(() =>
      xs.fromPromise(
        firebase
          .doUserInfoGet(user.auth.uid)
          .then((res) => res.data())
          .catch(() => ({ error: true }))
      )
    )
    .flatten()
    .map((userData) => {
      if (!userData.error) {
        dispatch(setInfo(userData))
      }
      return userData
    })
    .map((userData) => ({
      userData,
      isOwnProfile: true,
      userId: user.auth.uid,
    }))

  const loadPosts$ = showLikes$
    .compose(sampleCombine(userIdParam()))
    .map(([fetchLikedPosts, param]) => [
      fetchLikedPosts,
      param || user.auth.uid,
    ])
    .map(([fetchLikedPosts, userId]) =>
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
      loadOtherUserInfo$,
      loadPosts$,
      showLikes$.map((showingLikes) => ({
        showingLikes,
        showLikes,
        loadingPosts: true,
      }))
    )
    .startWith({ posts: [], loadingPosts: true })
    .map(toProps)
}

export default compose(
  connect((state) => ({ user: state.user, userbase: state.userbase })),
  withFirebase,
  withEffects(aperture, {
    mergeProps: true,
    errorHandler: () => (e) => console.log(e),
  })
)(Profile)
