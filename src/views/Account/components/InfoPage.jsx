import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withFirebase } from '../../../components/firebase'
import { setInfo } from '../../../redux/actions/user'

import './AvatarPage.scss'

const InfoPage = ({ user, firebase, dispatch }) => {
  const [name, setName] = useState('')

  const updateUserInfo = (e) => {
    e.preventDefault()
    const { auth, info } = user
    firebase.doUserInfoEdit(auth.uid, { ...info, name }).then(() => {
      dispatch(setInfo({ ...info, name }))
    })
  }

  return (
    <form>
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

export default connect(mapStateToProps)(withFirebase(InfoPage))
