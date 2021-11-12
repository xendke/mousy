import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withFirebase } from '~/components/firebase'
import InputForm from '~/components/shared/InputForm'
import { Firebase, User } from '~/types'

interface PostFormProps {
  user: User
  firebase: Firebase
  getFeed: () => void
}

const PostForm: React.FC<PostFormProps> = ({ user, firebase, getFeed }) => {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<Error>()

  const submitPost = async () => {
    setIsLoading(true)
    try {
      if (content.length === 0) throw new Error('Post content cannot be empty.')
      await firebase.doUserPostsAdd({
        userId: user.auth.uid,
        createdAt: Date.now(),
        content,
        interests: user.info.interests,
        likeCount: 0,
      })
      setContent('')
      setSuccess(true)
      getFeed()
    } catch (e) {
      setError(e)
    }
    setIsLoading(false)
  }

  return (
    <InputForm
      className="PostForm"
      user={user}
      content={content}
      setContent={(e) => {
        const { value } = e.target
        if (value.length <= 120) setContent(e.target.value)
      }}
      submit={submitPost}
      error={error}
      setError={setError}
      success={success}
      setSuccess={setSuccess}
      isLoading={isLoading}
    />
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(withFirebase(PostForm))
