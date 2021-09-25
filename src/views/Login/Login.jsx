import React, { useEffect, useState } from 'react'
// import { Redirect } from 'react-router-dom'
import Router from 'next/router'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faEyeSlash,
  faKey,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons'

import { withFirebase } from '~/components/firebase'
import isValidEmail from '~/utils/validation'

import styles from './Login.module.scss'

const Login = ({ user, firebase }) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(undefined)
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState(undefined)

  const eyeIcon = <FontAwesomeIcon icon={faEye} />
  const eyeSlashIcon = <FontAwesomeIcon icon={faEyeSlash} />

  console.log(user)
  useEffect(() => {
    // console.log(user)
    if (user.isSignedIn) {
      Router.push('/')
    }
  }, [user.isSignedIn])

  return (
    <>
      {/* {user.isSignedIn && <Redirect to="/" />} */}
      <form className="Login section">
        <h1>Hi there!</h1>

        <div className="field">
          <label htmlFor="email" className="label">
            Email
            <div className="control has-icons-left">
              <input
                className={`input ${emailError ? 'is-danger' : ''}`}
                id="email"
                type="text"
                value={email}
                onChange={(e) => {
                  const val = e.target.value
                  setErrorMessage(undefined)
                  setEmailError(undefined)
                  setEmail(val)
                }}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
            </div>
            {emailError && <p className="help is-danger">{emailError}</p>}
          </label>
        </div>

        <div className="field">
          <label htmlFor="password" className="label">
            Password
            <div className="control has-icons-left has-icons-right">
              <input
                className={`input ${passwordError ? 'is-danger' : ''}`}
                id="password"
                type={`${isPasswordHidden ? 'password' : 'text'}`}
                value={password}
                onChange={(e) => {
                  const val = e.target.value
                  setErrorMessage(undefined)
                  setPasswordError(undefined)
                  setPassword(val)
                }}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faKey} />
              </span>
              {password?.length > 0 && (
                <span
                  className="icon is-small is-right"
                  tabIndex={0}
                  role="button"
                  onClick={() => setIsPasswordHidden(!isPasswordHidden)}
                  onKeyDown={({ key }) =>
                    key === 'Enter' && setIsPasswordHidden(!isPasswordHidden)
                  }
                >
                  {isPasswordHidden ? eyeIcon : eyeSlashIcon}
                </span>
              )}
            </div>
          </label>
          {passwordError && <p className="help is-danger">{passwordError}</p>}
        </div>

        {errorMessage && (
          <div className="notification is-danger is-light">{errorMessage}</div>
        )}

        <button
          type="submit"
          className="button is-primary"
          onClick={(event) => {
            event.preventDefault()
            let error = false
            if (!isValidEmail(email)) {
              setEmailError('Invalid Email')
              error = true
            } else {
              setEmailError(undefined)
            }
            if (password.length < 1) {
              setPasswordError('Password cannot be empty.')
              error = true
            } else {
              setPasswordError(undefined)
            }
            if (error) return

            firebase
              .doSignInWithEmailAndPassword(email, password) // success handled by onAuthStateChanged
              .catch((e) => {
                setErrorMessage(e.message)
              })
          }}
        >
          Log in
        </button>
      </form>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(withFirebase(Login))
