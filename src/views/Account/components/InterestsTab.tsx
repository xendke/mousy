import React, { MouseEventHandler, useState } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { withFirebase } from '~/components/firebase'
import { InterestsSelect } from '~/components'
import { setInfo } from '~/redux/actions/user'
import { Firebase, User } from '~/types'

import styles from './InterestsTab.module.scss'

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
    console.log('interests', interests)
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
    <form className={styles.InterestsTab}>
      {success && (
        <div className="notification is-success is-light">
          Successfully updated your interests!
        </div>
      )}
      <div className="field">
        <div className="control">
          <label htmlFor="interests" className="label">
            Interests
            <InterestsSelect
              id="interests"
              defaultInterests={user.info.interests}
              getInterests={getInterests}
            />
          </label>
        </div>
      </div>
      <div className="control">
        <button
          type="submit"
          className="button is-primary"
          onClick={updateUserInterests}
          disabled={loading}
        >
          Update
        </button>
      </div>
    </form>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(withFirebase(InterestsTab))
