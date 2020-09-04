import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { withFirebase } from '../../components/firebase'
import isValidEmail from '../../utils/validation'
import './Login.scss'

const Login = ({ user, firebase }) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(undefined)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState(undefined)

  return (
    <>
      {user.isSignedIn && <Redirect to="/me" />}
      <form className="Login section">
        <h1>Hi there!</h1>

        <div className="field">
          <label htmlFor="email" className="label">
            Email
            <div className="control has-icons-left has-icons-right">
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
                <i className="fas fa-envelope" />
              </span>
              {emailError && (
                <span className="icon is-small is-right">
                  <i className="fas fa-exclamation-triangle" />
                </span>
              )}
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
                type="password"
                value={password}
                onChange={(e) => {
                  const val = e.target.value
                  setErrorMessage(undefined)
                  setPasswordError(undefined)
                  setPassword(val)
                }}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-key" />
              </span>
              {passwordError && (
                <span className="icon is-small is-right">
                  <i className="fas fa-exclamation-triangle" />
                </span>
              )}
            </div>
          </label>
          {passwordError && <p className="help is-danger">{passwordError}</p>}
        </div>

        {errorMessage && (
          <article className="message is-danger">
            <div className="message-body">{errorMessage}</div>
          </article>
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
