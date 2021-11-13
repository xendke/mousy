import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withFirebase } from '~/components/firebase'
import { compose } from '~/utils'
import InputForm from '~/components/shared/InputForm'

import { Firebase, User } from '~/types'

interface CommentFormProps {
  user: User
  firebase: Firebase
  postId: string
}

const CommentForm: React.FC<CommentFormProps> = ({
  user,
  firebase,
  postId,
}) => {
  const [content, setContent] = useState('')
  const [error, setError] = useState<Error>()
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const submitComment = async () => {
    if (content.length === 0) {
      setError(new Error('Comment cannot be empty.'))
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
      user={user}
      content={content}
      setContent={(event) => {
        const { value } = event.target
        if (value.length <= 120) setContent(value)
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
