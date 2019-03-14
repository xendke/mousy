import React from 'react';
import './Join.scss';

const Join = () => {
	return (
		<form className="section">
			<div className="field">
				<label className="label">Name</label>
				<div className="control">
					<input className="input" type="text" placeholder="John Doe" />
				</div>
			</div>

			<div className="field">
				<label className="label">Username</label>
				<div className="control">
					<input className="input" type="text" placeholder="shy-guy" />
				</div>
			</div>

			<div className="field">
				<label className="label">Email</label>
				<div className="control">
					<input className="input" type="text" placeholder="your@email.com" />
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
						I agree to the <a href="https://google.com">terms and conditions</a>
					</label>
				</div>
			</div>

			<div className="field is-grouped">
				<div className="control">
					<button className="button is-primary is-inverted">Submit</button>
				</div>
				<div className="control">
					<button className="button is-text">Cancel</button>
				</div>
			</div>
		</form>
	);
}

export default Join;