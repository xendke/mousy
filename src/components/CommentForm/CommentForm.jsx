import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withFirebase } from '~/components/firebase'
import { compose } from '~/utils'
import InputForm from '~/components/shared/InputForm'

import './CommentForm.scss'

const CommentForm = ({ user, firebase, postId }) => {
  const [content, setContent] = useState('')
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const submitComment = async () => {
    if (content.length === 0) {
      setError('Comment cannot be empty.')
      return
    }
    setIsLoading(true)
    try {
      await firebase.doPostCommentAdd({
        userId: user.auth.uid,
        createdAt: Date.now(),
        postId,
        content,
      })
      setContent('')
      setSuccess(true)
    } catch (e) {
      setError(e)
    }
    setIsLoading(false)
  }
  return (
    <InputForm
      className="CommentForm"
      user={user}
      content={content}
      setContent={(e) => {
        const { value } = e.target
        if (value.length <= 120) setContent(e.target.value)
      }}
      submit={submitComment}
      error={error}
      setError={setError}
      success={success}
      setSuccess={setSuccess}
      isLoading={isLoading}
      isForCommenting
    />
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default compose(connect(mapStateToProps), withFirebase)(CommentForm)
