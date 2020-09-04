import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { withFirebase } from '../../components/firebase'
import { debounce } from '../../utils'

import './Join.scss'

class Join extends React.Component {
  checkIfUsernameExists = debounce((isValidUsername) => {
    const { username } = this.state
    const { firebase } = this.props
    if (isValidUsername) {
      firebase.doUsernameExistsCheck(username).then((res) => {
        this.setState({
          usernameIsAvailable: !res.exists,
          checkingUsernameExists: false,
        })
      })
    } else {
      this.setState({
        usernameIsAvailable: false,
        checkingUsernameExists: false,
      })
    }
  }, 2000)

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      username: '',
      email: '',
      password: '',
      interests: '',
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const { name, value } = event.target
    const isValidUsername = name === 'username' && value.length > 4

    this.setState(
      () => ({
        [name]: value,
        ...(isValidUsername && { checkingUsernameExists: true }),
      }),
      () => this.checkIfUsernameExists(isValidUsername)
    )
  }

  render() {
    const { user, firebase } = this.props
    if (user.isSignedIn) return <Redirect to="/me" />

    const {
      name,
      username,
      email,
      password,
      interests,
      usernameIsAvailable,
      checkingUsernameExists,
    } = this.state

    const usernameAvailabilityMessage = () => {
      if (checkingUsernameExists) {
        return <p className="help">Checking if username is available...</p>
      }
      if (usernameIsAvailable) {
        return <p className="help">Username is available!</p>
      }
      if (username.length > 4) {
        return <p className="help">Username is not available</p>
      }

      return null
    }

    return (
      <form className="section">
        <h1>Sign Up</h1>
        <p>Join a community that listens!</p>
        <div className="field">
          <div className="control">
            <label htmlFor="name" className="label">
              Name
              <input
                className="input"
                id="name"
                type="text"
                name="name"
                value={name}
                onChange={this.handleChange}
              />
            </label>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label htmlFor="username" className="label">
              Username
              <input
                className="input"
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={this.handleChange}
              />
            </label>
          </div>
          {usernameAvailabilityMessage()}
        </div>

        <div className="field">
          <div className="control">
            <label htmlFor="email" className="label">
              Email
              <input
                className="input"
                id="email"
                type="text"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
            </label>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label htmlFor="password" className="label">
              Password
              <input
                className="input"
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
            </label>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <label htmlFor="interests" className="label">
              Interests
              <textarea
                className="textarea"
                id="interests"
                name="interests"
                value={interests}
                onChange={this.handleChange}
              />
            </label>
          </div>
          <p className="help">Comma-separated list of interests.</p>
        </div>

        <div className="field">
          <div className="control">
            <label htmlFor="checkbox" className="checkbox">
              <input type="checkbox" id="checkbox" />
              <span className="checkbox-label">
                I agree to the
                <a href="https://google.com"> terms and conditions</a>
              </span>
            </label>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              onClick={async (event) => {
                event.preventDefault()
                try {
                  const { exists } = await firebase.doUsernameExistsCheck(
                    username
                  )
                  if (!exists) {
                    const formattedInterests = interests
                      .toLowerCase()
                      .split(',')
                      .map((s) => s.trim())

                    const authUser = await firebase.doCreateUserWithEmailAndPassword(
                      email,
                      password
                    )
                    await firebase.doUserInfoEdit(authUser.user.uid, {
                      name,
                      username,
                      email,
                      interests: formattedInterests,
                    })
                    await firebase.doUsernameRegister(
                      username,
                      authUser.user.uid
                    )
                    await firebase.doSignInWithEmailAndPassword(email, password)
                  }
                } catch (error) {
                  console.error(error)
                }
              }}
            >
              Sign up
            </button>
          </div>
          <div className="control to-login">
            <Link to="/login" className="is-text">
              Already have an account?
            </Link>
          </div>
        </div>
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
