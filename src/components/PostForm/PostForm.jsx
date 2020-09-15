import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Avatar from '~/components/Avatar/Avatar'
import { withFirebase } from '~/components/firebase'

import './PostForm.scss'

const PostForm = ({ user, firebase }) => {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const submitPost = async () => {
    setIsLoading(true)
    try {
      if (content.length === 0) throw new Error('Post content cannot be empty.')
      await firebase.doUserPostsAdd({
        userId: user.auth.uid,
        createdAt: Date.now(),
        content,
        interests: user.info.interests,
      })
      setContent('')
      setSuccess(true)
    } catch (e) {
      setError(e)
    }
    setIsLoading(false)
  }

  return (
    <div className="PostForm box">
      <form className="field is-grouped">
        <Link className="image" to="/me">
          <Avatar userId={user.auth.uid} />
        </Link>
        <p className="control is-expanded">
          <input
            className="input"
            type="text"
            placeholder="What's up?"
            value={content}
            onChange={(e) => {
              const { value } = e.target
              if (value.length <= 120) setContent(e.target.value)
            }}
          />
        </p>
        <p className="control">
          <button
            type="submit"
            className={`button is-primary ${isLoading ? 'is-loading' : null}`}
            onClick={submitPost}
            disabled={isLoading}
          >
            Post
          </button>
        </p>
      </form>
      {success && !error && (
        <div className="notification is-primary is-light">
          <button
            type="button"
            className="delete"
            onClick={() => setSuccess(false)}
          />
          Your post was published!
        </div>
      )}
      {error && error.message && (
        <div className="notification is-danger is-light">
          <button
            type="button"
            className="delete"
            onClick={() => setError(false)}
          />
          {error.message}
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(withFirebase(PostForm))
