import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { withEffects, toProps } from 'refract-xstream'
import { formatDistanceToNowStrict } from 'date-fns'
import xs from 'xstream'
import { connect } from 'react-redux'
import { compose } from '~/utils'
import { withFirebase } from '~/components/firebase'
import { setLikedPosts } from '~/redux/actions/user'

import styles from './Post.module.scss'

const Post = ({
  postId,
  userFullName,
  username,
  userId,
  content,
  createdAt,
  likeCount,
  onLike,
  liked,
  hideCommentIcon,
  uid,
}) => {
  const timePosted = formatDistanceToNowStrict(createdAt)
  const userRoute = uid === userId ? '/me' : `/shy/${userId}`
  const author = (
    <>
      <strong className="is-capitalized has-text-grey-darker">
        {userFullName}
      </strong>
      <small className="has-text-grey-dark"> @{username}</small>
    </>
  )

  return (
    <div className={`${styles.Post} box`}>
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              {userId ? <Link href={userRoute}>{author}</Link> : author}
              <small className="has-text-grey-light"> {timePosted} ago</small>
              <br />
              {content}
            </p>
          </div>
          <nav className="level is-mobile">
            <div className="level-left">
              <div className="field has-addons">
                {!hideCommentIcon && (
                  <p className="control">
                    <Link href={`/post/${postId}`}>
                      <button
                        type="button"
                        className="button is-small is-text has-text-primary"
                      >
                        <span className="icon">
                          <FontAwesomeIcon icon={faComment} />
                        </span>
                      </button>
                    </Link>
                  </p>
                )}
                <p className="control">
                  <button
                    type="button"
                    onClick={() => onLike(true)}
                    className={`button is-small is-text ${
                      liked ? 'has-text-danger' : 'has-text-primary'
                    }`}
                  >
                    <span className="icon">
                      <FontAwesomeIcon icon={faHeart} />
                    </span>
                    <span>{likeCount}</span>
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

const aperture = (
  component,
  { likeCount, firebase, postId, user, dispatch }
) => {
  const [postLiked$, onLike] = component.useEvent('likePost')
  const { uid } = user.auth

  return xs
    .merge(
      postLiked$
        .filter((value) => value && postId)
        .map(() => xs.fromPromise(firebase.doPostLikeToggle(postId, uid)))
        .flatten()
        .map(({ liked, likedPosts }) => {
          dispatch(setLikedPosts(likedPosts))
          return liked
        })
        .fold(
          (previous, liked) => ({
            likeCount: liked ? previous.likeCount + 1 : previous.likeCount - 1,
            liked,
          }),
          { likeCount: likeCount || 0 }
        ),
      postLiked$.mapTo({
        onLike,
        uid,
      })
    )
    .map(toProps)
}

export default compose(
  connect((state) => ({ user: state.user })),
  withFirebase,
  withEffects(aperture, { mergeProps: true })
)(Post)
