import React from 'react'
import { formatDistanceToNowStrict } from 'date-fns'

import './Post.scss'

const Post = ({ userFullName, username, content, createdAt }) => {
  const timePosted = formatDistanceToNowStrict(createdAt)

  return (
    <div className="Post box">
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              <strong className="is-capitalized">{userFullName}</strong>
              <small> @{username}</small>
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
