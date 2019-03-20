import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { withFirebase } from '../components/firebase';
import { connect } from 'react-redux';
import * as userActions from '../redux/actions/user';
import './Login.scss';

const LogIn = (props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState(undefined);

	return (
		<React.Fragment>
			{ props.user.isSignedIn &&
				<Redirect to="/profile"/>
			}
			<form className="section">
				<div className="field">
					<label className="label">Email</label>
					<div className="control">
						<input className="input" type="text" placeholder="your@email.com" value={email} onChange={(e) => {
							const val = e.target.value;
							setErrorMessage(undefined);
							setEmail(val);
						}} />
					</div>
				</div>

				<div className="field">
					<label className="label">Password</label>
					<div className="control">
						<input className="input" type="password" placeholder="secretPassw0rd" value={password} onChange={(e) => {
							const val = e.target.value;
							setErrorMessage(undefined);
							setPassword(val);
						}} />
					</div>
				</div>

				{ errorMessage &&
					<article className="message is-danger">
						<div className="message-body">
							{ errorMessage }
						</div>
					</article>
				}

				<div className="field is-grouped">
					<div className="control">
						<button
							className="button is-primary is-inverted"
							onClick={(e) => {
								e.preventDefault();
								props.firebase.doSignInWithEmailAndPassword(email, password)
									.then(authUser => {
										props.dispatch(userActions.signIn());
									})
									.catch(error => {
										setErrorMessage(error.message);
									});
							}}
						>
							Log in
						</button>
					</div>
				</div>
			</form>
		</React.Fragment>
	);
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
	}
}

export default connect(mapStateToProps)(withFirebase(LogIn));