import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TopNav.scss';

const TopNav = () => {
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
							<Link to="/join" className="button is-primary is-inverted">Sign up</Link>
							<Link to="/login" className="button is-primary is-inverted is-outlined">Log in</Link>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default TopNav;