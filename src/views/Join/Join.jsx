import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { withFirebase } from '~/components/firebase'
import { debounce } from '~/utils'

import { Info, Credentials } from './components'

import './Join.scss'

const getRandomInterests = () => {
  const interests = [
    ['walking', 'napping', 'traveling'],
    ['tv', 'sports', 'tech'],
    ['video games', 'cosplay', 'art'],
  ]
  const randomIndex = Math.floor(Math.random() * interests.length)
  return interests[randomIndex]
}

class Join extends React.Component {
  checkIfUsernameExists = debounce((isValidUsername) => {
    const { username } = this.state
    const { firebase } = this.props
    if (isValidUsername) {
      firebase.doUsernameExistsCheck(username).then((res) => {
        this.setState(() => ({
          usernameIsAvailable: !res.exists,
          checkingUsernameExists: false,
        }))
      })
    } else {
      this.setState(() => ({
        usernameIsAvailable: false,
        checkingUsernameExists: false,
      }))
    }
  }, 2000)

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      username: '',
      email: '',
      emailConfirmation: '',
      password: '',
      interests: getRandomInterests(),
      error: null,
      step: 'info',
    }

    this.handleChange = this.handleChange.bind(this)
    this.setError = this.setError.bind(this)
  }

  setError(message) {
    this.setState(() => ({ error: message }))
  }

  handleChange(event) {
    const { name, value } = event.target
    const isValidUsername = name === 'username' && value.length > 4

    this.setState(
      () => ({
        [name]: value,
        ...(isValidUsername && { checkingUsernameExists: true }),
      }),
      () => {
        if (isValidUsername) this.checkIfUsernameExists(isValidUsername)
      }
    )
  }

  render() {
    const { user } = this.props
    if (user.isSignedIn) return <Redirect to="/me" />

    const {
      name,
      username,
      email,
      emailConfirmation,
      password,
      interests,
      error,
      usernameIsAvailable,
      checkingUsernameExists,
      step,
    } = this.state

    const Continue = (
      <div className="field is-grouped">
        <div className="control ">
          <button
            type="button"
            className="button is-primary"
            onClick={() => {
              if (name.length <= 2) {
                return this.setError('Name is too short.')
              }
              if (username.length <= 4) {
                return this.setError('Username is too short.')
              }
              if (!usernameIsAvailable) {
                return this.setError('Username is not available.')
              }
              if (interests.length < 2) {
                return this.setError('Must have at least two interests.')
              }
              return this.setState(() => ({ step: 'credentials', error: null }))
            }}
          >
            Continue
          </button>
        </div>

        <div className="control to-login">
          <Link to="/login" className="is-text">
            Already have an account?
          </Link>
        </div>
      </div>
    )

    return (
      <form className="section">
        <h1>Sign Up</h1>
        <p>Join a community that listens!</p>
        {error && (
          <div className="notification is-danger is-light">{error}</div>
        )}
        {step === 'info' ? (
          <Info
            handleChange={this.handleChange}
            name={name}
            username={username}
            interests={interests}
            checkingUsernameExists={checkingUsernameExists}
            usernameIsAvailable={usernameIsAvailable}
            action={Continue}
          />
        ) : (
          <Credentials
            handleChange={this.handleChange}
            email={email}
            emailConfirmation={emailConfirmation}
            password={password}
            name={name}
            username={username}
            interests={interests}
            setError={this.setError}
          />
        )}
      </form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(withFirebase(Join))
