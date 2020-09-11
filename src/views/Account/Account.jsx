/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { withFirebase } from '../../components/firebase'

import './Account.scss'

const Account = ({ user, firebase }) => {
  const [picture, setPicture] = useState(null)
  const [currentTab, setCurrentTab] = useState('avatar')
  const [uploading, setUploading] = useState(false)

  const onChangePicture = (e) => {
    setPicture(e.target.files[0])
  }

  const uploadAvatar = () => {
    setUploading(true)
    firebase
      .doUploadUserAvatar(user.auth.uid, picture)
      .then(() => setUploading(false))
      .catch((error) => console.error(error))
  }

  if (!user.isSignedIn) {
    return <Redirect to="/login" />
  }

  const tabContents = {
    avatar: (
      <>
        <input type="file" onChange={(e) => onChangePicture(e)} />
        <button type="button" onClick={uploadAvatar} disabled={uploading}>
          Upload
        </button>
      </>
    ),
    info: <div />,
    lol: <div />,
  }

  return (
    <div className="Account container">
      <div className="box">
        <div className="tabs">
          <ul>
            <li className="is-active">
              <a
                onClick={() => setCurrentTab('avatar')}
                role="button"
                onKeyDown={() => setCurrentTab('avatar')}
                tabIndex="0"
              >
                Avatar
              </a>
            </li>
            <li>
              <a
                onClick={() => setCurrentTab('info')}
                role="button"
                onKeyDown={() => setCurrentTab('info')}
                tabIndex="0"
              >
                Info
              </a>
            </li>
            <li>
              <a
                onClick={() => setCurrentTab('lol')}
                role="button"
                onKeyDown={() => setCurrentTab('lol')}
                tabIndex="0"
              >
                Lol
              </a>
            </li>
          </ul>
        </div>
        {tabContents[currentTab]}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(withFirebase(Account))
