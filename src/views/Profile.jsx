import React from 'react';
import { connect } from 'react-redux';

const Profile = (props) => {
	if(!props.user.auth) {
		return <div>Not Signed In.</div>;
	}

	return (
		<section className="section">
			<p>
				Welcome back, {props.user.auth.email}!
			</p>
		</section>
	);
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
	}
}

export default connect(mapStateToProps)(Profile);