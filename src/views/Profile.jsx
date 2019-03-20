import React from 'react';
import { connect } from 'react-redux';

const Profile = (props) => {
	console.log(props.user);
	return (
		<div>{ props.user.auth ? props.user.auth.email : 'Not Signed In'}</div>
	);
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
	}
}

export default connect(mapStateToProps)(Profile);