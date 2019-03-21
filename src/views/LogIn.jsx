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
	const [errorMessage, setErrorMessage] = useState(undefined);

	return (
		<React.Fragment>
			{ props.user.isSignedIn &&
				<Redirect to="/profile"/>
			}
			<form className="section">

				<div className="field">
					<label className="label">Email</label>
					<div className="control has-icons-left has-icons-right">
						<input className={`input ${emailError ? 'is-danger' : ''}`} type="text" placeholder="your@email.com" 
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
						<p className="help is-danger">This email is invalid</p>
					}
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
								if(!isValidEmail(email)) {
									setEmailError("Invalid Email");
									return;
								} else {
									setEmailError(undefined);
								}
								props.firebase.doSignInWithEmailAndPassword(email, password) // success handled by onAuthStateChanged
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