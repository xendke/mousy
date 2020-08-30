import React, { useState, useEffect } from 'react';
import Post from '../components/Post';
import Loading from '../components/Loading';
import { connect } from 'react-redux';
import { withFirebase } from '../components/firebase';

const Profile = ({ user, firebase }) => {
	if(!user.auth) return (<Loading />);

	const userData = user && user.info;
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		(async function() {
			const postsCollection = await firebase.doUserPostsGet(user.auth.uid);
			const posts = [];

			postsCollection.forEach((post) => {
				posts.push(post.data())
			})
			setPosts(posts);
		})();
	}, [user.auth]);

	if(!userData) return (<Loading />);

	return (
		<section className="section">
			<div className="level">
				<div className="level-item">
					<figure className="image is-64x64">
						<img className="is-rounded" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQCoxWc5ukrkkaNHBArZt7YJq15_xWWDb4NdQ&usqp=CAU" alt="User Avatar"/>
					</figure>
				</div>
			</div>
			<h1 className="title has-text-centered is-capitalized">
				{userData.name}
			</h1>
			<h2 className="subtitle has-text-centered">
				#{userData.interests}
			</h2>
			{
				posts.map(({ content }) => (
					<Post key={content} userFullName={userData.name} username={userData.username} content={content}/>
				))
			}
		</section>
	);
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
	}
}

export default connect(mapStateToProps)(withFirebase(Profile));