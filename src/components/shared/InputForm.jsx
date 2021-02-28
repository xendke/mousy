import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '~/components/Avatar/Avatar'

import './InputForm.scss'

const InputForm = ({
  className = '',
  user,
  content,
  setContent,
  isLoading,
  submit,
  success,
  setSuccess,
  error,
  setError,
  isForCommenting,
}) => (
  <div className={`InputForm box ${className}`}>
    <form className="field is-grouped">
      <Link className="image" to="/me">
        <Avatar userId={user.auth.uid} />
      </Link>
      <p className="control is-expanded">
        <input
          className="input"
          type="text"
          placeholder={isForCommenting ? 'Comment...' : "What's up?"}
          value={content}
          onChange={setContent}
        />
      </p>
      <p className="control">
        <button
          type="submit"
          className={`button is-primary ${isLoading ? 'is-loading' : null}`}
          onClick={submit}
          disabled={isLoading}
        >
          {isForCommenting ? 'Comment' : 'Post'}
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
        {`Your ${isForCommenting ? 'comment' : 'post'} was published!`}
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

export default InputForm
