import React, { ChangeEventHandler } from 'react'
import Link from 'next/link'
import cn from 'classnames'
import Avatar from '~/components/Avatar/Avatar'

import styles from './InputForm.module.scss'
import { User } from '~/types'

interface InputFormProps {
  user: User
  content: string
  setContent: ChangeEventHandler<HTMLInputElement>
  isLoading: boolean
  submit: () => void
  success: boolean
  setSuccess: (s: boolean) => void
  error: Error | undefined
  setError: (e?: Error) => void
  isForCommenting?: boolean
  className?: string
}

const InputForm: React.FC<InputFormProps> = ({
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
  className,
}) => (
  <div className={cn('InputForm', 'box', className)}>
    <form className={cn('field', 'is-grouped', styles.group)}>
      <Link href="/me" passHref>
        <a href="wow" className={cn('image', styles.avatar)}>
          <Avatar userId={user.auth.uid} />
        </a>
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
        <button type="button" className="delete" onClick={() => setError()} />
        {error.message}
      </div>
    )}
  </div>
)

InputForm.defaultProps = {
  className: '',
  isForCommenting: false,
}

export default InputForm
