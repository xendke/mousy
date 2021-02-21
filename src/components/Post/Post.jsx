import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNowStrict } from 'date-fns'

import './Post.scss'

const Post = ({
  userFullName,
  username,
  userId,
  content,
  createdAt,
  likeCount,
}) => {
  const timePosted = formatDistanceToNowStrict(createdAt)
  const userRoute = `/shy/${userId}`
  const author = (
    <>
      <strong className="is-capitalized has-text-grey-darker">
        {userFullName}
      </strong>
      <small className="has-text-grey-dark"> @{username}</small>
    </>
  )

  return (
    <div className="Post box">
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              {userId ? <Link to={userRoute}>{author}</Link> : author}
              <small className="has-text-grey-light"> {timePosted} ago</small>
              <br />
              {content}
            </p>
          </div>
          <nav className="level is-mobile">
            <div className="level-left">
              <div className="field has-addons">
                <p className="control">
                  <button
                    type="button"
                    className="button is-small is-text has-text-primary"
                  >
                    <span className="icon">
                      <i className="fas fa-retweet" />
                    </span>
                  </button>
                </p>
                <p className="control">
                  <button
                    type="button"
                    className="button is-small is-text has-text-primary"
                  >
                    <span className="icon">
                      <i className="fas fa-comment" />
                    </span>
                  </button>
                </p>
                <p className="control">
                  <button
                    type="button"
                    className="button is-small is-text has-text-primary"
                  >
                    <span className="icon">
                      <i className="fas fa-heart" />
                    </span>
                    <span>{likeCount || 0}</span>
                  </button>
                </p>
              </div>
            </div>
          </nav>
        </div>
      </article>
    </div>
  )
}

export default Post
