import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { withFirebase } from '../components/firebase';
import { connect } from 'react-redux';
import { isValidEmail } from '../utils/validation';
import './Login.scss';

const LogIn = (props) => {
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState(undefined);
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState(undefined);
	const [errorMessage, setErrorMessage] = useState(undefined);

	return (
		<React.Fragment>
			{ props.user.isSignedIn &&
				<Redirect to="/profile"/>
			}
			<form className="Login section">
				<h1>
					Hi there!
				</h1>

				<div className="field">
					<label className="label">Email</label>
					<div className="control has-icons-left has-icons-right">
						<input className={`input ${emailError ? 'is-danger' : ''}`} type="text"
							value={email}
							onChange={(e) => {
								const val = e.target.value;
								setErrorMessage(undefined);
								setEmailError(undefined);
								setEmail(val);
							}} 
						/>
						<span className="icon is-small is-left">
							<i className="fas fa-envelope"></i>
						</span>
						{ emailError && 
							<span className="icon is-small is-right">
								<i className="fas fa-exclamation-triangle"></i>
							</span>
						}
					</div>
					{ emailError && 
						<p className="help is-danger">{emailError}</p>
					}
				</div>

				<div className="field">
					<label className="label">Password</label>
					<div className="control has-icons-left has-icons-right">
						<input className={`input ${passwordError ? 'is-danger' : ''}`} type="password" 
							value={password}
							onChange={(e) => {
								const val = e.target.value;
								setErrorMessage(undefined);
								setPasswordError(undefined);
								setPassword(val);
							}} 
						/>
						<span className="icon is-small is-left">
							<i className="fas fa-key"></i>
						</span>
						{ passwordError && 
							<span className="icon is-small is-right">
								<i className="fas fa-exclamation-triangle"></i>
							</span>
						}
					</div>
					{ passwordError && 
						<p className="help is-danger">{passwordError}</p>
					}
				</div>

				{ errorMessage &&
					<article className="message is-danger">
						<div className="message-body">
							{ errorMessage }
						</div>
					</article>
				}

				<button
					className="button is-primary"
					onClick={(e) => {
						e.preventDefault();
						let error = false;
						if(!isValidEmail(email)) {
							setEmailError("Invalid Email");
							error = true;
						} else {
							setEmailError(undefined);
						}
						if(password.length < 1) {
							setPasswordError("Password cannot be empty.");
							error = true;
						} else {
							setPasswordError(undefined);
						}
						if(error) return;

						props.firebase.doSignInWithEmailAndPassword(email, password) // success handled by onAuthStateChanged
							.catch(error => {
								setErrorMessage(error.message);
							});
					}}
				>
					Log in
				</button>
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