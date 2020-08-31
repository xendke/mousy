import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import PostForm from '../components/PostForm';
import Post from '../components/Post';
import { connect } from 'react-redux';
import { withFirebase } from '../components/firebase';
import personImage from '../assets/person.png';

import './Home.scss';

const Home = ({ otherUsers, user, firebase }) => {
	const [posts, setPosts] = useState([])
	if(!user.auth && user.isSignedIn) return (<Loading />);

	useEffect(() => {
		const getFeed = async () => {
			const postsCollection = await firebase.doInterestsPostsGet(user.info.interests)
			const newPosts = [];
			postsCollection.forEach((post) => {
				const user = post.data()
				newPosts.push(user)
				
				// check if we have cache for user, if not then go on
				firebase.doUserInfoGet(user.userId).then((userInfo) => {
					// dispatch action to store userId info
					// userInfo.data()
				})
			})
			
			setPosts(newPosts)
		}
		if(user.info.interests) getFeed()
	}, [user.info])

	if(!user.isSignedIn) {
		return (
			<div className="the-fold columns">
				<div className="fold-text column">
					<h1>Don't Be Shy!</h1>
					<p>Connect with people like you.</p>
				</div>
				<div className="fold-image column">
					<img src={personImage} alt="Digitally rendered human sitting with pets."/>
				</div>
			</div>
		);
	}

	const userData = user && user.info

	if(userData) {
		return (
			<div className="Feed">
				<PostForm />
				<h1 className="title is-medium">
					Feed
				</h1>
				{posts.map(({ content, userId }, index) => {
					const user = otherUsers[userId] || { name: 'Loading User', username: 'loading'}
					return <Post key={index} userFullName={user.name} username={user.username} content={content}/>
				})}
			</div>
		)
	}
	return null
}

const mapStateToProps = (state) => 
	({
		user: state.user,
		otherUsers: state.otherUsers
	})

export default connect(mapStateToProps)(withFirebase(Home));