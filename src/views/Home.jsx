import './Home.scss';
import React from 'react';
import personImage from '../assets/person.png';

const Home = () => {
	return (
		<div className="the-fold columns">
			<div className="fold-text column">
				<h1>Don't Be Shy!</h1>
				<p>Connect with people like you.</p>
			</div>
			<div className="fold-image column">
				<img src={personImage} alt="Digitally rendered human sitting with pets."/>
			</div>
		</div>
	);
}

export default Home;