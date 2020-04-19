import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from '../components/firebase';

const Profile = ({ user, firebase }) => {
	if(!user.auth) return (<div>Not Signed In.</div>);

	const [userData, setUserData] = useState(undefined);

	useEffect(() => {
		(async function() {
			const userInfo = await firebase.doUserInfoGet(user.auth.uid);
			setUserData(userInfo.data());
		})();
	}, []);

	if(!userData) return (<div>Loading</div>);

	return (
		<section className="section">
			<p>
				Welcome back, {userData.name}!
			</p>
			<p>Your interests: {userData.interests}</p>
		</section>
	);
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
	}
}

export default connect(mapStateToProps)(withFirebase(Profile));