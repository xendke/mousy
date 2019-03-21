import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withFirebase } from './firebase';
import './TopNav.scss';

const TopNav = (props) => {
	const [isNavbarOpened, setIsNavbarOpened] = useState(false);

	const toggleNavbar = () => { setIsNavbarOpened(!isNavbarOpened); };

	return (
		<nav className="navbar" role="navigation" aria-label="main navigation">
			<div className="navbar-brand">
				<Link className="navbar-item" to="/">
					Shy App
				</Link>

				<button
					className={`navbar-burger burger ${isNavbarOpened ? 'is-active' : ''}`} 
					aria-label="menu" aria-expanded="false" 
					data-target="navbarButtons"
					onClick={toggleNavbar}
				>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</button>
			</div>

			<div id="navbarButtons" className={`navbar-menu ${isNavbarOpened ? 'is-active' : ''}`}>
				<div className="navbar-end">
					<div className="navbar-item">
						<div className="buttons" onClick={toggleNavbar}>
							{ props.user.isSignedIn &&
								(
									<button
										className="button is-primary is-inverted"
										onClick={() => {
											props.firebase.doSignOut() // success handled by onAuthChanged
												.then(() => {
													props.history.push('/');
												});
										}}
									>
										Log Out
									</button>
								)
							}
							{ !props.user.isSignedIn &&
								(
									<React.Fragment>
										<Link to="/join" className="button is-primary is-inverted">Sign up</Link>
										<Link to="/login" className="button is-primary is-inverted is-outlined">Log in</Link>
									</React.Fragment>
								)
							}
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
	}
}

export default withRouter(connect(mapStateToProps)(withFirebase(TopNav)));