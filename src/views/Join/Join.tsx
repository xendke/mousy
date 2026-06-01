import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { connect } from 'react-redux'
import { withFirebase } from '~/components/firebase'
import { debounce } from '~/utils'
import { Info, Credentials } from './components'
import { User, Firebase } from '~/types'
import { Alert } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

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
      (prev) => ({
        ...prev,
        [name]: value,
        ...(isValidUsername && { checkingUsernameExists: true }),
      }),
      () => {
        if (isValidUsername) this.checkIfUsernameExists(isValidUsername)
      }
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
        this.setState((prev) => ({
          ...prev,
          usernameIsAvailable: !res.exists,
          checkingUsernameExists: false,
        }))
      })
    } else {
      this.setState((prev) => ({
        ...prev,
        usernameIsAvailable: false,
        checkingUsernameExists: false,
      }))
    }
  }, 2000)

  render() {
    const { user } = this.props
    if (user.isSignedIn) return Router.push('/me')

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
      <div className="flex items-center gap-4 mt-4">
        <Button
          type="button"
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
        </Button>
        <Link href="/login" className="text-sm text-brand hover:underline">
          Already have an account?
        </Link>
      </div>
    )

    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-lavender/30 px-4 py-10">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign Up</h1>
            <p className="text-gray-500 mb-6">Join a community that listens!</p>
            {error && (
              <Alert variant="danger" className="mb-4">{error}</Alert>
            )}
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
          </CardContent>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(withFirebase(Join))
