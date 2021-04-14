import React from 'react'
import { InterestsSelect } from '~/components'

const Info = ({
  handleChange,
  name,
  username,
  interests,
  checkingUsernameExists,
  usernameIsAvailable,
  action,
}) => {
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
    <>
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
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </label>
        </div>
        {usernameAvailabilityMessage()}
      </div>

      <div className="field">
        <div className="control">
          <label htmlFor="interests" className="label">
            Interests
            <InterestsSelect
              id="interests"
              defaultInterests={interests}
              getInterests={(value) =>
                handleChange({
                  target: { name: 'interests', value },
                })
              }
            />
          </label>
        </div>
        <p className="help">Comma-separated list of interests.</p>
      </div>

      {action}
    </>
  )
}

export default Info
