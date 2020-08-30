import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../components/firebase';

import './PostForm.scss'

const PostForm = ({ user, firebase }) => {
	const [content, setContent] = useState('')
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState(false)

	const submitPost = async () => {
		try {
			if(content.length === 0) throw new Error('Post content cannot be empty.')
			await firebase.doUserPostsAdd(
				user.auth.uid,
				{ 
					userId: user.auth.uid,
					createdAt: Date.now(),
					content,
				}
			);
			setContent('')
			setSuccess(true)
		} catch(error) {
			setError(error)
		}
	}

	return (
		<div className="PostForm box">
			<div className="field is-grouped">
				<p className="control is-expanded">
					<input 
						className="input"
						type="text"
						placeholder="What's up?"
						value={content}
						onChange={(e) => {
							setContent(e.target.value)
						}}
					/>
				</p>
				<p className="control">
					<button 
						className="button is-primary"
						onClick={submitPost}
					>
						Post
					</button>
				</p>
			</div>
			{ success && !error && (
				<div className="notification is-primary is-light">
					<button className="delete" onClick={() => setSuccess(false)}></button>
					Your post was published!
				</div>
			)}
			{ error && error.message && (
				<div className="notification is-danger is-light">
					<button className="delete" onClick={() => setError(false)}></button>
					{error.message}
				</div>
			)}
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
	}
}

export default connect(mapStateToProps)(withFirebase(PostForm));