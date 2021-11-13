import React from 'react'
import xs, { Stream } from 'xstream'
import { connect } from 'react-redux'
import { withEffects, toProps } from 'refract-xstream'
import { withRouter } from 'next/router'
import cn from 'classnames'
import { withFirebase } from '~/components/firebase'
import { compose } from '~/utils'
import { Post, Loading, Comment, CommentForm, Empty } from '~/components'

import {
  Firebase,
  Post as PostInt,
  User,
  Userbase,
  Comment as CommentInt,
} from '~/types'

import styles from './PostDiscussion.module.scss'

const renderComments = (comments: CommentInt[] = []) =>
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

interface PostDiscussionProps {
  user: User
  post: PostInt
  userbase: Userbase
  comments: CommentInt[]
}

const PostDiscussion: React.FC<PostDiscussionProps> = ({
  user,
  post,
  userbase,
  comments,
}) => {
  if (!post) return <Loading />
  const { id, content, createdAt, likeCount, userId: authorId } = post
  const author = userbase[authorId] || user.info
  return (
    <div className={cn(styles.PostDiscussion, 'column')}>
      <h1 className={cn(styles.title, 'title is-medium')}>Comments</h1>
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
      {renderComments(comments)}
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
  withRouter,
  withEffects(
    (component, { firebase }: { firebase: Firebase }) => {
      const getPostId = (): Stream<string> =>
        component
          .observe('router', ({ query }) => query.postId)
          .filter(Boolean)
          .take(1)

      const loadPost$ = getPostId()
        .map((postId) => xs.fromPromise(firebase.doPostGet(postId)))
        .flatten()
        .map((post) => toProps({ post }))

      const loadComments$ = getPostId()
        .map((postId) => xs.fromPromise(firebase.doCommentsGet(postId)))
        .flatten()
        .debug('COMMENTS')
        .map((comments) => toProps({ comments }))

      return xs.merge(loadPost$, loadComments$)
    },
    {
      mergeProps: true,
    }
  )
)(PostDiscussion)
