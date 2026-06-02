import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { connect } from 'react-redux'
import { withFirebase } from '~/components/firebase'
import { debounce } from '~/utils'
import { Info, Credentials } from './components'
import { User, Firebase } from '~/types'
import { Alert } from '~/components/ui/alert'

const GRADIENT = 'linear-gradient(180deg,#ece7fa 0%,#e6effc 38%,#fbeede 78%,#fde9ea 100%)'

const getRandomInterests = () => {
  const interests = [
    ['walking', 'napping', 'traveling'],
    ['tv', 'sports', 'tech'],
    ['video games', 'cosplay', 'art'],
  ]
  const randomIndex = Math.floor(Math.random() * interests.length)
  return interests[randomIndex]
}

interface JoinProps {
  user: User
  firebase: Firebase
}

interface JoinState {
  name: string
  username: string
  email: string
  emailConfirmation: string
  password: string
  interests: string[]
  error: string | null
  step: 'info' | 'credentials'
  usernameIsAvailable: boolean
  checkingUsernameExists: boolean
}

class Join extends React.Component<JoinProps, JoinState> {
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
      usernameIsAvailable: false,
      checkingUsernameExists: false,
    }
    this.handleChange = this.handleChange.bind(this)
    this.setError = this.setError.bind(this)
  }

  handleChange(event) {
    const { name, value } = event.target
    const isValidUsername = name === 'username' && value.length > 4
    this.setState(
      (prev) => ({ ...prev, [name]: value, ...(isValidUsername && { checkingUsernameExists: true }) }),
      () => { if (isValidUsername) this.checkIfUsernameExists(isValidUsername) }
    )
  }

  setError(message) {
    this.setState(() => ({ error: message }))
  }

  checkIfUsernameExists = debounce((isValidUsername) => {
    const { username } = this.state
    const { firebase } = this.props
    if (isValidUsername) {
      firebase.doUsernameExistsCheck(username).then((res) => {
        this.setState((prev) => ({ ...prev, usernameIsAvailable: !res.exists, checkingUsernameExists: false }))
      })
    } else {
      this.setState((prev) => ({ ...prev, usernameIsAvailable: false, checkingUsernameExists: false }))
    }
  }, 2000)

  render() {
    const { user } = this.props
    if (user.isSignedIn) { Router.push('/me'); return null }

    const { name, username, email, emailConfirmation, password, interests, error, usernameIsAvailable, checkingUsernameExists, step } = this.state

    const Continue = (
      <div className="flex items-center gap-4 mt-4">
        <button
          type="button"
          style={{ background: '#0c0c0c', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 999, height: 48, padding: '0 28px', cursor: 'pointer' }}
          onClick={() => {
            if (name.length <= 2) return this.setError('Name is too short.')
            if (username.length <= 4) return this.setError('Username is too short.')
            if (!usernameIsAvailable) return this.setError('Username is not available.')
            if (interests.length < 2) return this.setError('Must have at least two interests.')
            this.setState(() => ({ step: 'credentials', error: null }))
          }}
        >
          Continue
        </button>
        <Link href="/login" style={{ fontSize: 14, color: '#181f2a', fontWeight: 600, borderBottom: '1.5px solid rgba(12,12,12,.25)', textDecoration: 'none' }}>
          Already have an account?
        </Link>
      </div>
    )

    const heading = step === 'info' ? 'Join Mousy' : 'Almost there'
    const sub = step === 'info' ? 'Create your account.' : 'Set up your login details.'

    return (
      <div
        className="flex items-center justify-center px-4 py-10"
        style={{ minHeight: 'calc(100vh - 74px)', background: GRADIENT }}
      >
        <div style={{ width: '100%', maxWidth: 460, background: '#fff', border: '2px solid #0c0c0c', borderRadius: 26, overflow: 'hidden' }}>
          <div style={{ padding: '36px 38px 34px' }}>

            {/* Tab switcher */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, background: '#fff', border: '2px solid #0c0c0c', borderRadius: 999, padding: 5, marginBottom: 24 }}>
              <Link href="/login" style={{ color: '#6b7280', fontWeight: 700, fontSize: 15, padding: '10px 0', borderRadius: 999, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                Log in
              </Link>
              <div style={{ background: '#0c0c0c', color: '#fff', fontWeight: 700, fontSize: 15, padding: '10px 0', borderRadius: 999, textAlign: 'center' }}>
                Sign up
              </div>
            </div>

            <h1 style={{ fontFamily: '"Archivo", sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: '-0.01em', lineHeight: 1.05, color: '#181f2a' }}>
              {heading}
            </h1>
            <p style={{ color: '#6b7280', fontSize: 15, marginTop: 8, marginBottom: 24 }}>{sub}</p>

            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            <form>
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
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({ user: state.user })
export default connect(mapStateToProps)(withFirebase(Join))
