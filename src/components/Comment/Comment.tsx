import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import { formatDistanceToNowStrict } from 'date-fns'
import { compose } from '~/utils'
import Avatar from '~/components/Avatar/Avatar'

import { User, Userbase } from '~/types'

interface CommentProps {
  content: string
  authorId: string
  userbase: Userbase
  createdAt: number
  user: User
}

const Comment: React.FC<CommentProps> = ({
  content,
  authorId,
  userbase,
  createdAt,
  user,
}) => {
  const authorData = userbase[authorId] || user.info
  const timePosted = formatDistanceToNowStrict(createdAt)
  const author = (
    <>
      <strong className="capitalize text-gray-700">{authorData.name}</strong>
      <small className="text-gray-500"> @{authorData.username}</small>
    </>
  )

  return (
    <div className="flex gap-4 rounded-2xl bg-white shadow-sm border border-gray-100 p-4 mb-3">
      <div>
        <div className="h-12 w-12">
          <Link href={`/shy/${authorId}`}>
            <Avatar userId={authorId} />
          </Link>
        </div>
      </div>
      <div className="flex-1">
        <div>
          <p>
            {authorId ? (
              <Link href={`/shy/${authorId}`}>{author}</Link>
            ) : (
              author
            )}
            <small className="text-gray-400"> {timePosted} ago</small>
            <br />
            {content}
          </p>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  userbase: state.userbase,
})

export default compose(connect(mapStateToProps))(Comment)
