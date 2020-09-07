import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { withFirebase } from '../../components/firebase'

import './Account.scss'

const Account = ({ user, firebase }) => {
  const [picture, setPicture] = useState(null)

  const onChangePicture = (e) => {
    setPicture(e.target.files[0])
  }

  const uploadAvatar = () => {
    firebase
      .doUploadUserAvatar(user.auth.uid, picture)
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => console.log(url))
  }

  if (!user.isSignedIn) {
    return <Redirect to="/login" />
  }
  return (
    <div className="Account container">
      <div className="box">
        Account
        <input type="file" onChange={(e) => onChangePicture(e)} />
        <button type="button" onClick={uploadAvatar}>
          Upload
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(withFirebase(Account))
