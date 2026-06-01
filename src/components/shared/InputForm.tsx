import React, { ChangeEventHandler } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import Avatar from '~/components/Avatar/Avatar'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Alert } from '~/components/ui/alert'
import { cn } from '~/lib/utils'

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
  isForCommenting = false,
  className = '',
}) => (
  <div className={cn('rounded-2xl bg-white border-2 border-black p-4 mb-3', className)}>
    <form className="flex items-start gap-3">
      <Link href="/me" className="shrink-0">
        <Avatar userId={user.auth.uid} />
      </Link>
      <div className="flex-1">
        <Input
          type="text"
          placeholder={isForCommenting ? 'Comment...' : "What's up?"}
          value={content}
          onChange={setContent}
        />
      </div>
      <Button
        type="submit"
        onClick={submit}
        disabled={isLoading}
      >
        {isForCommenting ? 'Comment' : 'Post'}
      </Button>
    </form>
    {success && !error && (
      <Alert variant="default" className="mt-3">
        {`Your ${isForCommenting ? 'comment' : 'post'} was published!`}
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="ml-auto"
        >
          <X className="h-4 w-4" />
        </button>
      </Alert>
    )}
    {error && error.message && (
      <Alert variant="danger" className="mt-3">
        {error.message}
        <button
          type="button"
          onClick={() => setError()}
          className="ml-auto"
        >
          <X className="h-4 w-4" />
        </button>
      </Alert>
    )}
  </div>
)

export default InputForm
