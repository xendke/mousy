import React from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../components/firebase';
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
    this.setState({ [event.target.name]: event.target.value });
  };
	render() {
		const { name, username, email, password, interests } = this.state;
		return (
			<form className="section">
				<p>
					Join a community that listens! Share your story...
				</p>
				<div className="field">
					<label className="label">Name</label>
					<div className="control">
						<input className="input" type="text" placeholder="John Doe" value={name} onChange={this.handleChange}/>
					</div>
				</div>

				<div className="field">
					<label className="label">Username</label>
					<div className="control">
						<input className="input" type="text" placeholder="shy-guy" value={username} onChange={this.handleChange}/>
					</div>
				</div>

				<div className="field">
					<label className="label">Email</label>
					<div className="control">
						<input className="input" type="text" placeholder="your@email.com" value={email} onChange={this.handleChange}/>
					</div>
				</div>

				<div className="field">
					<label className="label">Password</label>
					<div className="control">
						<input className="input" type="password" placeholder="secretPassw0rd" value={password} onChange={this.handleChange}/>
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
						<textarea
							className="textarea"
							placeholder="Tell us about yourself"
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
							className="button is-primary is-inverted"
							onClick={(e) => {
								e.preventDefault();
								this.props.firebase.doCreateUserWithEmailAndPassword(email, password)
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
}

export default withFirebase(Join);