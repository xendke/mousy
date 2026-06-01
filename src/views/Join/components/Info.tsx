import React from 'react'
import { InterestsSelect } from '~/components'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface InfoProps {
  handleChange: (e: { target: { name: string; value: string } }) => void
  name: string
  username: string
  interests: string[]
  checkingUsernameExists: boolean
  usernameIsAvailable: boolean
  action: React.ReactNode
}

const Info: React.FC<InfoProps> = ({
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
      return <p className="mt-1 text-xs text-gray-500">Checking if username is available...</p>
    }
    if (usernameIsAvailable) {
      return <p className="mt-1 text-xs text-green-600">Username is available!</p>
    }
    if (username.length > 4) {
      return <p className="mt-1 text-xs text-red-500">Username is not available</p>
    }

    return null
  }

  return (
    <>
      <div className="mb-4">
        <Label htmlFor="name">Name</Label>
        <Input
          className="mt-1"
          id="name"
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="username">Username</Label>
        <Input
          className="mt-1"
          id="username"
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
        />
        {usernameAvailabilityMessage()}
      </div>

      <div className="mb-4">
        <Label htmlFor="interests">Interests</Label>
        <div className="mt-1">
          <InterestsSelect
            id="interests"
            defaultInterests={interests}
            getInterests={(value) =>
              handleChange({
                target: { name: 'interests', value },
              })
            }
          />
        </div>
      </div>

      {action}
    </>
  )
}

export default Info
