import React from 'react'
import xs from 'xstream'
import { connect } from 'react-redux'
import { withEffects, toProps } from 'refract-xstream'
import { withFirebase } from '~/components/firebase'
import { compose } from '~/utils'
import { Post, Loading, Comment } from '~/components'

import './PostDiscussion.scss'

const PostDiscussion = ({ user, post, userbase }) => {
  if (!post) return <Loading />
  const { id, content, createdAt, likeCount, userId: authorId } = post
  const author = userbase[authorId] || user.info
  return (
    <div className="PostDiscussion">
      <h1 className="title is-medium">Post</h1>
      <Post
        postId={id}
        userFullName={author?.name}
        username={author?.username}
        content={content}
        createdAt={createdAt}
        likeCount={likeCount}
        liked={user.info?.likedPosts?.includes(id)}
      />
      <Comment />
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
      return component.mount
        .mapTo(xs.fromPromise(firebase.doPostGet(params.postId)))
        .flatten()
        .map((post) => toProps({ post }))
    },
    {
      errorHandler: () => (e) => console.log(e),
    }
  )
)(PostDiscussion)
