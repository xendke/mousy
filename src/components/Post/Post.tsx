import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { withEffects, toProps } from 'refract-xstream'
import { formatDistanceToNowStrict } from 'date-fns'
import xs from 'xstream'
import { connect } from 'react-redux'
import cn from 'classnames'
import { compose } from '~/utils'
import { withFirebase } from '~/components/firebase'
import { setLikedPosts } from '~/redux/actions/user'

import styles from './Post.module.scss'

interface PostProps {
  postId: string
  userFullName: string
  username: string
  userId: string
  content: string
  createdAt: number
  likeCount: number
  onLike: (l: boolean) => void
  liked: boolean
  hideCommentIcon: boolean
  uid: string
}

const Post: React.FC<PostProps> = ({
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
    <div className={cn(styles.Post, 'box')}>
      <article className={cn(styles.media, 'media')}>
        <div className="media-content">
          <div className={cn(styles.content, 'content')}>
            <p>
              {userId ? (
                <Link href={userRoute} passHref>
                  <a href="wow">{author}</a>
                </Link>
              ) : (
                author
              )}
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
                    <Link href={`/post/${postId}`} passHref>
                      <button
                        type="button"
                        className={cn(
                          styles.button,
                          'button is-small is-text has-text-primary'
                        )}
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
                    className={cn(
                      styles.button,
                      'button is-small is-text',
                      liked ? 'has-text-danger' : 'has-text-primary'
                    )}
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

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default compose(
  connect(mapStateToProps),
  withFirebase,
  withEffects(aperture, { mergeProps: true })
)(Post)
