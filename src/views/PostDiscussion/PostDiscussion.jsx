import React from 'react'
import xs from 'xstream'
import { connect } from 'react-redux'
import { withEffects, toProps } from 'refract-xstream'
import { withFirebase } from '~/components/firebase'
import { compose } from '~/utils'
import { Post, Loading, Comment, CommentForm, Empty } from '~/components'

import styles from './PostDiscussion.module.scss'

const Comments = ({ comments = [] }) =>
  comments.length > 0 ? (
    comments.map(({ id, content, userId, createdAt }) => (
      <Comment
        key={id}
        authorId={userId}
        content={content}
        createdAt={createdAt}
      />
    ))
  ) : (
    <Empty message="No comments yet!" />
  )

const PostDiscussion = ({ user, post, userbase, comments }) => {
  if (!post) return <Loading />
  const { id, content, createdAt, likeCount, userId: authorId } = post
  const author = userbase[authorId] || user.info
  return (
    <div className="PostDiscussion column">
      <h1 className="title is-medium">Comments</h1>
      <Post
        postId={id}
        userFullName={author?.name}
        username={author?.username}
        content={content}
        createdAt={createdAt}
        likeCount={likeCount}
        liked={user.info?.likedPosts?.includes(id)}
        hideCommentIcon
      />
      <CommentForm postId={id} />
      <Comments comments={comments} />
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  userbase: state.userbase,
})

export default compose(
  connect(mapStateToProps),
  withFirebase,
  withEffects(
    (component, { firebase, match }) => {
      const { params } = match
      const loadPost$ = component.mount
        .mapTo(xs.fromPromise(firebase.doPostGet(params.postId)))
        .flatten()
        .map((post) => toProps({ post }))

      const loadComments$ = component.mount
        .mapTo(xs.fromPromise(firebase.doCommentsGet(params.postId)))
        .flatten()
        .map((comments) => toProps({ comments }))

      return xs.merge(loadPost$, loadComments$)
    },
    {
      mergeProps: true,
    }
  )
)(PostDiscussion)
