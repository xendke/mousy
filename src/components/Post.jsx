import React from 'react';

import './Post.scss'

const Post = ({ userFullName, username, content }) => {
	return (
		<div className="Post box">
			<article className="media">
				{/* <div className="media-left">
					<figure className="image is-64x64">
						<img src="https://bulma.io/images/placeholders/128x128.png" alt="User Avatar"/>
					</figure>
				</div> */}
				<div className="media-content">
					<div className="content">
						<p>
							<strong className="is-capitalized">{userFullName}</strong> <small>@{username}</small> <small>31m</small>
							<br/>
							{ content }
						</p>
					</div>
					<nav className="level is-mobile">
						<div className="level-left">
							<a className="level-item" aria-label="reply" href="https://google.com">
								<span className="icon is-small has-text-primary">
									<i className="fas fa-reply" aria-hidden="true"></i>
								</span>
							</a>
							<a className="level-item" aria-label="retweet" href="https://google.com">
								<span className="icon is-small has-text-primary">
									<i className="fas fa-retweet" aria-hidden="true"></i>
								</span>
							</a>
							<a className="level-item" aria-label="like" href="https://google.com">
								<span className="icon is-small has-text-primary">
									<i className="fas fa-heart" aria-hidden="true"></i>
								</span>
							</a>
						</div>
					</nav>
				</div>
			</article>
		</div>
	);
}

export default Post;