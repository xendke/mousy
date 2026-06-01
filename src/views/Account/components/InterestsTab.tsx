import React, { MouseEventHandler, useState } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { withFirebase } from '~/components/firebase'
import { InterestsSelect } from '~/components'
import { setInfo } from '~/redux/actions/user'
import { Firebase, User } from '~/types'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Alert } from '~/components/ui/alert'

interface Props {
  user: User
  firebase: Firebase
  dispatch: Dispatch
}

const InterestsTab: React.FC<Props> = ({ user, firebase, dispatch }) => {
  const [interests, setInterests] = useState(user.info.interests || [])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const updateUserInterests: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    setLoading(true)
    const { auth, info } = user
    firebase.doUserInfoEdit(auth.uid, { ...info, interests }).then(() => {
      setLoading(false)
      setSuccess(true)
      dispatch(setInfo({ ...info, interests }))
    })
  }

  const getInterests = (newInterests) => {
    setInterests(newInterests)
  }

  return (
    <form className="space-y-4 py-4">
      {success && (
        <Alert variant="success">Successfully updated your interests!</Alert>
      )}
      <div>
        <Label htmlFor="interests">Interests</Label>
        <div className="mt-1">
          <InterestsSelect
            id="interests"
            defaultInterests={user.info.interests}
            getInterests={getInterests}
          />
        </div>
      </div>
      <Button type="submit" onClick={updateUserInterests} disabled={loading}>
        Update
      </Button>
    </form>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(withFirebase(InterestsTab))
