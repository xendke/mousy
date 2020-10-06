import React from 'react'
import { withFirebase } from '~/components/firebase'
import { formatInterests } from '~/utils'

const Credentials = ({
  handleChange,
  email,
  password,
  name,
  username,
  interests,
  setError,
  firebase,
}) => {
  return (
    <>
      <div className="field">
        <div className="control">
          <label htmlFor="email" className="label">
            Email
            <input
              autoComplete="off"
              className="input"
              id="email"
              type="text"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      <div className="field">
        <div className="control">
          <label htmlFor="password" className="label">
            Password
            <input
              autoComplete="off"
              className="input"
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </label>
        </div>
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

      <div className="control">
        <button
          type="submit"
          className="button is-primary"
          onClick={async (event) => {
            event.preventDefault()
            try {
              if (username.length < 4) {
                throw Error('Username must be at least 4 characters.')
              }

              const formattedInterests = formatInterests(interests)

              if (formattedInterests.length < 2) {
                throw Error('You should have at least two interests.')
              }

              const { exists } = await firebase.doUsernameExistsCheck(username)
              if (!exists) {
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
      </div>
    </>
  )
}

export default withFirebase(Credentials)
