import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Avatar, ImageCropper } from '../../../components'
import { withFirebase } from '../../../components/firebase'

import './AvatarPage.scss'

const AvatarPage = ({ user, firebase }) => {
  const [inputFile, setInputFile] = useState(null)
  const [picture, setPicture] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [userId, setUserId] = useState(user.auth.uid)

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
        setSuccess(true)
      })
      .catch((error) => console.error(error))
  }

  const getImageBlob = (blob) => {
    setPicture(blob)
  }

  useEffect(() => {
    setUserId(userId)
  }, [success, userId])

  return (
    <div className="AvatarPage">
      {success && (
        <div className="notification is-success is-light">
          Successfully updated your avatar!
        </div>
      )}
      <Avatar userId={userId} />
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
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(withFirebase(AvatarPage))
