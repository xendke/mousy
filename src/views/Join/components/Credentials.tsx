import React from 'react'
import { withFirebase } from '~/components/firebase'
import { Firebase } from '~/types'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface CredentialsProps {
  handleChange: (e: { target: { name: string; value: string } }) => void
  email: string
  emailConfirmation: string
  password: string
  name: string
  username: string
  interests: string[]
  setError: (e: string) => void
  firebase: Firebase
}

const Credentials: React.FC<CredentialsProps> = ({
  handleChange,
  email,
  emailConfirmation,
  password,
  name,
  username,
  interests,
  setError,
  firebase,
}) => {
  return (
    <>
      <div className="mb-4">
        <Label htmlFor="email">Email</Label>
        <Input
          className="mt-1"
          id="email"
          type="text"
          name="email"
          value={email}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="emailConfirmation">Confirm Email</Label>
        <Input
          className="mt-1"
          id="emailConfirmation"
          type="text"
          name="emailConfirmation"
          value={emailConfirmation}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="password">Password</Label>
        <Input
          className="mt-1"
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
        />
      </div>

      <div className="mb-6 flex items-center gap-2">
        <input type="checkbox" id="checkbox" className="h-4 w-4" />
        <label htmlFor="checkbox" className="text-sm text-gray-600">
          I agree to the{' '}
          <a href="https://google.com" className="font-semibold underline" style={{ color: '#181f2a' }}>terms and conditions</a>
        </label>
      </div>

      <button
        type="submit"
        style={{ background: '#0c0c0c', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 999, height: 54, width: '100%', cursor: 'pointer', marginTop: 4 }}
        onClick={async (event) => {
          event.preventDefault()
          try {
            if (email !== emailConfirmation) {
              throw Error('Emails do not match.')
            }

            if (interests.length < 2) {
              throw Error('You should have at least two interests.')
            }

            const { exists } = await firebase.doUsernameExistsCheck(username)
            if (!exists) {
              const authUser =
                await firebase.doCreateUserWithEmailAndPassword(email, password)
              await firebase.doUserInfoEdit(authUser.user.uid, {
                name,
                username,
                email,
                likedPosts: [],
                interests,
              })
              await firebase.doUsernameRegister(username, authUser.user.uid)
              await firebase.doSignInWithEmailAndPassword(email, password)
            }
          } catch (e) {
            setError(e.message)
          }
        }}
      >
        Sign up
      </button>
    </>
  )
}

export default withFirebase(Credentials)
