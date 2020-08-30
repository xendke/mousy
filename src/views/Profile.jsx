import React, { useState, useEffect } from 'react';
import Post from '../components/Post';
import Loading from '../components/Loading';
import { connect } from 'react-redux';
import { withFirebase } from '../components/firebase';

const Profile = ({ user, firebase }) => {
	if(!user.auth) return (<Loading />);

	const [userData, setUserData] = useState(undefined);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		(async function() {
			const userInfo = await firebase.doUserInfoGet(user.auth.uid);
			setUserData(userInfo.data());
		})();
		(async function() {
			// await firebase.doUserPostsAdd(user.auth.uid, {name: 'hellow'});

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
			<p>
				Welcome back, {userData.name}!
			</p>
			<p>Your interests: {userData.interests}</p>
			{posts.map((post) => (
				<Post key={post.name} data={post}/>
			))}
		</section>
	);
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
	}
}

export default connect(mapStateToProps)(withFirebase(Profile));