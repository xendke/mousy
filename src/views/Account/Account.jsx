/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { ImageCropper } from '../../components'
import { withFirebase } from '../../components/firebase'

import './Account.scss'

const Account = ({ user, firebase }) => {
  const [inputFile, setInputFile] = useState(null)
  const [picture, setPicture] = useState(null)
  const [currentTab, setCurrentTab] = useState('avatar')
  const [uploading, setUploading] = useState(false)

  const onChangePicture = (e) => {
    const file = e.target.files[0]
    if (file) {
      const objectURL = URL.createObjectURL(file)
      setInputFile(objectURL)
    }
  }

  const uploadAvatar = () => {
    setUploading(true)
    firebase
      .doUploadUserAvatar(user.auth.uid, picture)
      .then(() => {
        setUploading(false)
        setPicture(null)
        setInputFile(null)
      })
      .catch((error) => console.error(error))
  }

  const getImageBlob = (blob) => {
    setPicture(blob)
  }

  if (!user.isSignedIn) {
    return <Redirect to="/login" />
  }

  const tabContents = {
    avatar: (
      <div className="AvatarPage">
        <label htmlFor="fileInpupt" className="button is-primary">
          Choose a File
          <input
            className="button"
            id="fileInput"
            type="file"
            onChange={(e) => onChangePicture(e)}
            accept="image/*"
          />
        </label>
        {inputFile && (
          <div className="cropper">
            <ImageCropper src={inputFile} getImageBlob={getImageBlob} />
          </div>
        )}
        {picture && (
          <button
            className="button is-primary"
            type="button"
            onClick={uploadAvatar}
            disabled={uploading}
          >
            Upload
          </button>
        )}
      </div>
    ),
    info: <div />,
    lol: <div />,
  }

  return (
    <div className="Account container section">
      <div className="box">
        <div className="tabs">
          <ul>
            <li className={currentTab === 'avatar' ? 'is-active' : null}>
              <a
                onClick={() => setCurrentTab('avatar')}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setCurrentTab('avatar')
                }}
                tabIndex="0"
              >
                Avatar
              </a>
            </li>
            <li className={currentTab === 'info' ? 'is-active' : null}>
              <a
                onClick={() => setCurrentTab('info')}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setCurrentTab('info')
                }}
                tabIndex="0"
              >
                Info
              </a>
            </li>
            <li className={currentTab === 'lol' ? 'is-active' : null}>
              <a
                onClick={() => setCurrentTab('lol')}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setCurrentTab('lol')
                }}
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
