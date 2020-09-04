import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNowStrict } from 'date-fns'

import './Post.scss'

const Post = ({ userFullName, username, userId, content, createdAt }) => {
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
              <a
                className="level-item"
                aria-label="reply"
                href="https://google.com"
              >
                <span className="icon is-small has-text-primary">
                  <i className="fas fa-reply" aria-hidden="true" />
                </span>
              </a>
              <a
                className="level-item"
                aria-label="retweet"
                href="https://google.com"
              >
                <span className="icon is-small has-text-primary">
                  <i className="fas fa-retweet" aria-hidden="true" />
                </span>
              </a>
              <a
                className="level-item"
                aria-label="like"
                href="https://google.com"
              >
                <span className="icon is-small has-text-primary">
                  <i className="fas fa-heart" aria-hidden="true" />
                </span>
              </a>
            </div>
          </nav>
        </div>
      </article>
    </div>
  )
}

export default Post
