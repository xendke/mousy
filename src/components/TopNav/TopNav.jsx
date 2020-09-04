import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { withFirebase } from '../firebase'
import logoImage from '../../assets/logo.png'
import './TopNav.scss'

const TopNav = ({ user, history, firebase }) => {
  const [isNavbarOpened, setIsNavbarOpened] = useState(false)

  const toggleNavbar = () => {
    setIsNavbarOpened(!isNavbarOpened)
  }

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <img src={logoImage} alt="ShyApp Logo" className="navbar-logo" />
        </Link>

        <button
          type="button"
          className={`navbar-burger burger ${
            isNavbarOpened ? 'is-active' : ''
          }`}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarButtons"
          onClick={toggleNavbar}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <div
        id="navbarButtons"
        className={`navbar-menu ${isNavbarOpened ? 'is-active' : ''}`}
      >
        <div className="navbar-end">
          <div className="navbar-item">
            <div
              className="buttons"
              role="button"
              tabIndex="0"
              onKeyDown={toggleNavbar}
              onClick={toggleNavbar}
            >
              {user.isSignedIn && (
                <>
                  {!history.location.pathname.includes('profile') && (
                    <button
                      type="button"
                      className="button is-primary is-inverted is-outlined"
                      onClick={() => history.push('/me')}
                    >
                      Profile
                    </button>
                  )}
                  <button
                    type="button"
                    className="button is-primary is-inverted"
                    onClick={() => {
                      firebase
                        .doSignOut() // success handled by onAuthChanged
                        .then(() => {
                          history.push('/')
                        })
                    }}
                  >
                    Log Out
                  </button>
                </>
              )}
              {!user.isSignedIn && (
                <>
                  <Link to="/join" className="button is-primary is-inverted">
                    Sign up
                  </Link>
                  <Link
                    to="/login"
                    className="button is-primary is-inverted is-outlined"
                  >
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default withRouter(connect(mapStateToProps)(withFirebase(TopNav)))
