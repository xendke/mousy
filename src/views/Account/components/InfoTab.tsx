import React, { MouseEventHandler, useState } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { withFirebase } from '~/components/firebase'
import { setInfo } from '~/redux/actions/user'
import { Firebase, User } from '~/types'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Alert } from '~/components/ui/alert'

interface Props {
  user: User
  firebase: Firebase
  dispatch: Dispatch
}

const InfoTab: React.FC<Props> = ({ user, firebase, dispatch }) => {
  const [name, setName] = useState(user.info.name || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const updateUserInfo: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    setLoading(true)
    const { auth, info } = user
    const newInfo = { ...info, name }

    firebase.doUserInfoEdit(auth.uid, newInfo).then(() => {
      setLoading(false)
      setSuccess(true)
      setName('')
      dispatch(setInfo(newInfo))
    })
  }

  return (
    <form className="space-y-4 py-4">
      {success && (
        <Alert variant="success">Successfully updated your information!</Alert>
      )}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          className="mt-1"
          id="name"
          type="text"
          name="name"
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </div>
      <Button type="submit" onClick={updateUserInfo} disabled={loading}>
        Update
      </Button>
    </form>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(withFirebase(InfoTab))
