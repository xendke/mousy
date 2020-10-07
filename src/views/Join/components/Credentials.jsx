import React from 'react'
import { withFirebase } from '~/components/firebase'
import { formatInterests } from '~/utils'

const Credentials = ({
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
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      <div className="field">
        <div className="control">
          <label htmlFor="emailConfirmation" className="label">
            Confirm Email
            <input
              className="input"
              id="emailConfirmation"
              type="text"
              name="emailConfirmation"
              value={emailConfirmation}
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
              if (email !== emailConfirmation) {
                throw Error('Emails do not match.')
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
