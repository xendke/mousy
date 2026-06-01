import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import { Eye, EyeOff, KeyRound, Mail } from 'lucide-react'
import { withFirebase } from '~/components/firebase'
import isValidEmail from '~/utils/validation'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Alert } from '~/components/ui/alert'
import { Card, CardContent } from '~/components/ui/card'
import { Firebase, User } from '~/types'

interface LoginProps {
  user: User
  firebase: Firebase
}

const Login: React.FC<LoginProps> = ({ user, firebase }) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(undefined)
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(undefined)
  const [errorMessage, setErrorMessage] = useState(undefined)

  useEffect(() => {
    if (user.isSignedIn) {
      Router.push('/')
    }
  }, [user.isSignedIn])

  return (
    <div className="min-h-screen flex items-center justify-center bg-pastel-lavender/30 px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Hi there!</h1>
          <form>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="text"
                  className={`pl-9 ${
                    emailError
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : ''
                  }`}
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value
                    setErrorMessage(undefined)
                    setEmailError(undefined)
                    setEmail(val)
                  }}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-xs text-red-500">{emailError}</p>
              )}
            </div>

            <div className="mb-6">
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={isPasswordHidden ? 'password' : 'text'}
                  className={`pl-9 pr-9 ${
                    passwordError
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : ''
                  }`}
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value
                    setErrorMessage(undefined)
                    setPasswordError(undefined)
                    setPassword(val)
                  }}
                />
                {password?.length > 0 && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    tabIndex={0}
                    onClick={() => setIsPasswordHidden(!isPasswordHidden)}
                    onKeyDown={({ key }) =>
                      key === 'Enter' && setIsPasswordHidden(!isPasswordHidden)
                    }
                  >
                    {isPasswordHidden ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
              {passwordError && (
                <p className="mt-1 text-xs text-red-500">{passwordError}</p>
              )}
            </div>

            {errorMessage && (
              <Alert variant="danger" className="mb-4">
                {errorMessage}
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
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
                  .doSignInWithEmailAndPassword(email, password)
                  .catch((e) => {
                    setErrorMessage(e.message)
                  })
              }}
            >
              Log in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(withFirebase(Login))
