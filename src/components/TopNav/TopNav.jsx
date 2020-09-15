import React, { useState, useRef, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { withFirebase } from '~/components/firebase'
import logoImage from '~/assets/logo.png'

import './TopNav.scss'

const TopNav = ({ user, history, firebase }) => {
  const [isNavbarOpened, setIsNavbarOpened] = useState(false)
  const nodeRef = useRef()

  const closeNavbarAndGo = (path) => () => {
    setIsNavbarOpened(false)
    history.push(path)
  }

  const toggleNavbar = () => {
    setIsNavbarOpened(!isNavbarOpened)
  }

  const closeOnOutsideClick = (event) => {
    if (!nodeRef.current.contains(event.target)) {
      setIsNavbarOpened(false)
    }
  }

  useEffect(() => {
    if (isNavbarOpened) {
      document.addEventListener('mousedown', closeOnOutsideClick)
    } else {
      document.removeEventListener('mousedown', closeOnOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
    }
  }, [isNavbarOpened])

  return (
    <nav
      ref={nodeRef}
      className="navbar"
      role="navigation"
      aria-label="main navigation"
    >
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
            <div className="buttons">
              {user.isSignedIn && (
                <>
                  {!history.location.pathname.includes('/me') && (
                    <button
                      type="button"
                      className="button is-primary is-inverted is-outlined"
                      onClick={closeNavbarAndGo('/me')}
                    >
                      Profile
                    </button>
                  )}
                  <button
                    type="button"
                    className="button is-primary is-inverted"
                    onClick={() => {
                      toggleNavbar()
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
                  <button
                    onClick={closeNavbarAndGo('/join')}
                    type="button"
                    className="button is-primary is-inverted"
                  >
                    Sign up
                  </button>
                  <button
                    onClick={closeNavbarAndGo('/login')}
                    type="button"
                    className="button is-primary is-inverted is-outlined"
                  >
                    Log in
                  </button>
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
