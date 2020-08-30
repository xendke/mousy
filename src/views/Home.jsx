import React from 'react';
import Loading from '../components/Loading';
import PostForm from '../components/PostForm';
import { connect } from 'react-redux';
import { withFirebase } from '../components/firebase';
import personImage from '../assets/person.png';

import './Home.scss';

const Home = ({ user, firebase }) => {
	if(!user.auth && user.isSignedIn) return (<Loading />);

	const posts = [
		{
			content: ''
		},
		{
			content: ''
		}
	]

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
				<h1 className="title">
					Feed
				</h1>
			</div>
		)
	}
	return null
}

const mapStateToProps = (state) => 
	({
		user: state.user,
	})

export default connect(mapStateToProps)(withFirebase(Home));