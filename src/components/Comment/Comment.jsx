import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import { formatDistanceToNowStrict } from 'date-fns'
import { compose } from '~/utils'
import Avatar from '~/components/Avatar/Avatar'

const Comment = ({ content, authorId, userbase, createdAt, user }) => {
  const authorData = userbase[authorId] || user.info
  const timePosted = formatDistanceToNowStrict(createdAt)
  const author = (
    <>
      <strong className="is-capitalized has-text-grey-darker">
        {authorData.name}
      </strong>
      <small className="has-text-grey-dark"> @{authorData.username}</small>
    </>
  )

  return (
    <div className="box" style={{ margin: 0, marginBottom: 15 }}>
      <article className="media">
        <div className="media-left">
          <figure className="image is-48x48">
            <Link className="image" href={`/shy/${authorId}`}>
              <Avatar userId={authorId} />
            </Link>
          </figure>
        </div>
        <div className="media-content">
          <div className="content">
            <p>
              {authorId ? (
                <Link href={`/shy/${authorId}`}>{author}</Link>
              ) : (
                author
              )}
              <small className="has-text-grey-light"> {timePosted} ago</small>
              <br />
              {content}
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
  userbase: state.userbase,
})

export default compose(connect(mapStateToProps))(Comment)
