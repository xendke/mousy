import React from 'react'
import { Link } from 'react-router-dom'
import logoImage from '~/assets/logo.png'
import personImage from '~/assets/person.png'

const Landing = () => (
  <div className="Landing">
    <div className="fold-image column">
      <img
        src={personImage}
        alt="Digitally rendered human sitting with pets."
      />
    </div>
    <div className="right">
      <img src={logoImage} alt="ShyApp Logo" className="logo" />

      <div className="card">
        <div className="card-content">
          <p className="title">
            In a world of algorithms, hashtags, and followers, know the true
            importance of human connections.
          </p>
          <p className="subtitle">Find people like you!</p>
        </div>
        <footer className="card-footer">
          <Link to="/join" className="card-footer-item">
            Sign up
          </Link>
          <Link to="/login" className="card-footer-item">
            Log in
          </Link>
        </footer>
      </div>
    </div>
  </div>
)

export default Landing
