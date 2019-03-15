import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../components/firebase';
import './Join.scss';

const Join = (props) => {
	const [name, setName] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<form className="section">
			<p>
				Join a community that listens! Share your story...
			</p>
			<div className="field">
				<label className="label">Name</label>
				<div className="control">
					<input className="input" type="text" placeholder="John Doe" value={name} onChange={(e) => {
						const val =  e.target.value;
						setName(val);
					}}/>
				</div>
			</div>

			<div className="field">
				<label className="label">Username</label>
				<div className="control">
					<input className="input" type="text" placeholder="shy-guy" value={username} onChange={(e) => {
						const val =  e.target.value;
						setUsername(val);
					}}/>
				</div>
			</div>

			<div className="field">
				<label className="label">Email</label>
				<div className="control">
					<input className="input" type="text" placeholder="your@email.com" value={email} onChange={(e) => {
						const val =  e.target.value;
						setEmail(val);
					}}/>
				</div>
			</div>

			<div className="field">
				<label className="label">Password</label>
				<div className="control">
					<input className="input" type="password" placeholder="SuperSecret12" value={password} onChange={(e) => {
						const val =  e.target.value;
						setPassword(val);
					}}/>
				</div>
			</div>

			{/* <div className="field">
				<label className="label">Username</label>
				<div className="control has-icons-left has-icons-right">
					<input className="input is-success" type="text" placeholder="shy-guy" />
					<span className="icon is-small is-left">
						<i className="fas fa-user"></i>
					</span>
					<span className="icon is-small is-right">
						<i className="fas fa-check"></i>
					</span>
				</div>
				<p className="help is-success">This username is available</p>
			</div>

			<div className="field">
				<label className="label">Email</label>
				<div className="control has-icons-left has-icons-right">
					<input className="input is-danger" type="email" placeholder="your@email.com" />
					<span className="icon is-small is-left">
						<i className="fas fa-envelope"></i>
					</span>
					<span className="icon is-small is-right">
						<i className="fas fa-exclamation-triangle"></i>
					</span>
				</div>
				<p className="help is-danger">This email is invalid</p>
			</div> */}

			<div className="field">
				<label className="label">Interests</label>
				<div className="control">
					<textarea className="textarea" placeholder="Tell us about yourself"></textarea>
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
						className="button is-primary is-inverted"
						onClick={(e) => {
							e.preventDefault();
							props.firebase.doCreateUserWithEmailAndPassword(email, password)
								.then(authUser => {
									// this.setState({ ...INITIAL_STATE });
									console.log(authUser);
								})
								.catch(error => {
									// this.setState({ error });
									console.log(error);
								});
						}}
					>
						Sign up
					</button>
				</div>
				<div className="control">
					<Link to="/login" className="button is-text">Already have an account?</Link>
				</div>
			</div>
		</form>
	);
}

export default withFirebase(Join);