import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withFirebase } from '~/components/firebase'
import { setInfo } from '~/redux/actions/user'
import { formatInterests } from '~/utils'

import './InterestsTab.scss'

const InterestsTab = ({ user, firebase, dispatch }) => {
  const [interests, setInterests] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const updateUserInterests = (e) => {
    e.preventDefault()
    setLoading(true)
    const { auth, info } = user
    const interestsArray = formatInterests(interests)
    firebase
      .doUserInfoEdit(auth.uid, { ...info, interests: interestsArray })
      .then(() => {
        setLoading(false)
        setSuccess(true)
        setInterests('')
        dispatch(setInfo({ ...info, interests: interestsArray }))
      })
  }

  return (
    <form className="InterestsTab">
      {success && (
        <div className="notification is-success is-light">
          Successfully updated your interests!
        </div>
      )}
      <div className="field">
        <div className="control">
          <label htmlFor="interests" className="label">
            Interests
            <textarea
              className="input"
              id="interests"
              type="text"
              name="interests"
              value={interests}
              onChange={({ target }) => setInterests(target.value)}
            />
          </label>
        </div>
        <p className="help">Comma-separated list of interests.</p>
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
