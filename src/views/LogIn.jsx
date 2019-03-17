import React, { useState } from 'react';
import { withFirebase } from '../components/firebase';
// import './LogIn.scss';

const LogIn = (props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<form className="section">
			<div className="field">
				<label className="label">Email</label>
				<div className="control">
					<input className="input" type="text" placeholder="your@email.com" value={email} onChange={(e) => {
						const val = e.target.value;
						setEmail(val);
					}} />
				</div>
			</div>

			<div className="field">
				<label className="label">Password</label>
				<div className="control">
					<input className="input" type="password" placeholder="SuperSecret12" value={password} onChange={(e) => {
						const val = e.target.value;
						setPassword(val);
					}} />
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
						Log in
					</button>
				</div>
			</div>
		</form>
	);
}

export default withFirebase(LogIn);