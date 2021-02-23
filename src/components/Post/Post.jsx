import React from 'react'
import { Link } from 'react-router-dom'
import { withEffects, toProps } from 'refract-xstream'
import { formatDistanceToNowStrict } from 'date-fns'
import xs from 'xstream'
import { connect } from 'react-redux'
import { compose } from '~/utils'
import { withFirebase } from '~/components/firebase'

import './Post.scss'

const Post = ({
  userFullName,
  username,
  userId,
  content,
  createdAt,
  likeCount,
  onLike,
  liked,
}) => {
  const timePosted = formatDistanceToNowStrict(createdAt)
  const userRoute = `/shy/${userId}`
  const author = (
    <>
      <strong className="is-capitalized has-text-grey-darker">
        {userFullName}
      </strong>
      <small className="has-text-grey-dark"> @{username}</small>
    </>
  )

  const getLikes = () => {
    const selfCount = liked ? 1 : 0
    return likeCount ? likeCount + selfCount : selfCount
  }

  return (
    <div className="Post box">
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              {userId ? <Link to={userRoute}>{author}</Link> : author}
              <small className="has-text-grey-light"> {timePosted} ago</small>
              <br />
              {content}
            </p>
          </div>
          <nav className="level is-mobile">
            <div className="level-left">
              <div className="field has-addons">
                <p className="control">
                  <button
                    type="button"
                    className="button is-small is-text has-text-primary"
                  >
                    <span className="icon">
                      <i className="fas fa-retweet" />
                    </span>
                  </button>
                </p>
                <p className="control">
                  <button
                    type="button"
                    className="button is-small is-text has-text-primary"
                  >
                    <span className="icon">
                      <i className="fas fa-comment" />
                    </span>
                  </button>
                </p>
                <p className="control">
                  <button
                    type="button"
                    onClick={() => onLike(true)}
                    className={`button is-small is-text ${
                      liked ? 'has-text-danger' : 'has-text-primary'
                    }`}
                  >
                    <span className="icon">
                      <i className="fas fa-heart" />
                    </span>
                    <span>{getLikes()}</span>
                  </button>
                </p>
              </div>
            </div>
          </nav>
        </div>
      </article>
    </div>
  )
}

const aperture = (component, { firebase, postId, user }) => {
  const [postLiked$, onLike] = component.useEvent('likePost')
  const { uid } = user.auth

  return xs
    .merge(
      postLiked$
        .filter((value) => value && postId)
        .map(() => xs.fromPromise(firebase.doPostLikeToggle(postId, uid)))
        .flatten(),
      postLiked$.mapTo({
        onLike,
      })
    )
    .map(toProps)
}

export default compose(
  connect((state) => ({ user: state.user })),
  withFirebase,
  withEffects(aperture, { mergeProps: true })
)(Post)
