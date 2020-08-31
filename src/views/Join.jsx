import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { withFirebase } from '../components/firebase';
import { connect } from 'react-redux';
import './Join.scss';

class Join extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			username: '',
			email: '',
			password: '',
			interests: '',
		}

		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(event) {
		const { name, value } = event.target;
		const isValidUsername = (name === 'username' && value.length > 4);

		this.setState(
			{ 
				[name]: value,
				...(isValidUsername && { checkingUsernameExists: true }),
			}, () => {
				if (isValidUsername) {
					this.props.firebase.doUsernameExistsCheck(this.state.username)
						.then((res) => {
							this.setState({
								usernameIsAvailable: !res.exists,
								checkingUsernameExists: false,
							});
						});
				} else {
					this.setState({
						usernameIsAvailable: false,
						checkingUsernameExists: false,
					});
				}
		});
  };
	render() {
		if(this.props.user.isSignedIn) return (<Redirect to="/profile"/>);

		const { name, username, email, password, interests, usernameIsAvailable, checkingUsernameExists } = this.state;
		return (
			<form className="section">
				<h1>
					Sign Up
				</h1>
				<p>
					Join a community that listens!
				</p>
				<div className="field">
					<label className="label">Name</label>
					<div className="control">
						<input className="input" type="text" name="name" value={name} onChange={this.handleChange}/>
					</div>
				</div>

				<div className="field">
					<label className="label">Username</label>
					<div className="control">
						<input className="input" type="text" name="username" value={username} onChange={this.handleChange}/>
					</div>
					{ checkingUsernameExists ? 
						<p className="help">Checking if username is available...</p>
						:
						(
							usernameIsAvailable ? <p className="help">Username is available!</p>
							:
							( this.state.username.length > 4 ? <p className="help">Username is not available.</p> : <div></div>)
						)
					}
				</div>

				<div className="field">
					<label className="label">Email</label>
					<div className="control">
						<input className="input" type="text" name="email" value={email} onChange={this.handleChange}/>
					</div>
				</div>

				<div className="field">
					<label className="label">Password</label>
					<div className="control">
						<input className="input" type="password" name="password" value={password} onChange={this.handleChange}/>
					</div>
				</div>

				<div className="field">
					<label className="label">Interests</label>
					<div className="control">
						<textarea
							className="textarea"
							name="interests"
							value={interests}
							onChange={this.handleChange}
						>
						</textarea>
					</div>
				</div>

				<div className="field">
					<div className="control">
						<label className="checkbox">
							<input type="checkbox" />
							<span className="checkbox-label">
								I agree to the <a href="https://google.com">terms and conditions</a>
							</span>
						</label>
					</div>
				</div>

				<div className="field is-grouped">
					<div className="control">
						<button 
							className="button is-primary"
							onClick={(e) => {
								e.preventDefault();
								this.props.firebase.doUsernameExistsCheck(this.state.username)
									.then(res => {
										if(!res.exists) { // create user if username isn't taken.
											this.props.firebase.doCreateUserWithEmailAndPassword(email, password)
												.then(authUser => {
													this.props.firebase.doUserInfoEdit(authUser.user.uid, {
														name: this.state.name,
														username: this.state.username,
														email: this.state.email,
														interests: this.state.interests.split(','),
													})
													.then(() => {
														this.props.firebase.doUsernameRegister(this.state.username, authUser.user.uid);
													})
													.then(() => {
														this.props.firebase.doSignInWithEmailAndPassword(this.state.email, this.state.password);
													});
												})
												.catch(error => {
													// this.setState({ error });
													console.log(error);
												});
											}
										})
									.catch(err => {
										console.log(err);
									});
							}}
						>
							Sign up
						</button>
					</div>
					<div className="control to-login">
						<Link to="/login" className="is-text">Already have an account?</Link>
					</div>
				</div>
			</form>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		user: state.user,
	}
}

export default connect(mapStateToProps)(withFirebase(Join));