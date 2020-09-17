import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withFirebase } from '~/components/firebase'
import { setInfo } from '~/redux/actions/user'

import './InfoTab.scss'

const InfoTab = ({ user, firebase, dispatch }) => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const updateUserInfo = (e) => {
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
    <form className="InfoTab">
      {success && (
        <div className="notification is-success is-light">
          Successfully updated your information!
        </div>
      )}
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
              onChange={({ target }) => setName(target.value)}
            />
          </label>
        </div>
      </div>
      <div className="control">
        <button
          type="submit"
          className="button is-primary"
          onClick={updateUserInfo}
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

export default connect(mapStateToProps)(withFirebase(InfoTab))
