import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Avatar, ImageCropper } from '~/components'
import { withFirebase } from '~/components/firebase'
import getCroppedImg from '~/components/ImageCropper/helpers'
import { Firebase, User } from '~/types'

import styles from './AvatarTab.module.scss'

interface AvatarTabProps {
  user: User
  firebase: Firebase
}

const AvatarTab: React.FC<AvatarTabProps> = ({ user, firebase }) => {
  const [inputFile, setInputFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [successCount, setSuccessCount] = useState(0)
  const [crop, setCrop] = useState(null)

  const onChangePicture = (e) => {
    const file = e.target.files[0]
    if (file) {
      const objectURL = URL.createObjectURL(file)
      setInputFile(objectURL)
    }
  }

  const uploadAvatar = async () => {
    setUploading(true)
    const blob = await getCroppedImg(inputFile, crop)
    firebase
      .doUploadUserAvatar(user.auth.uid, blob)
      .then(() => {
        setUploading(false)
        setInputFile(null)
        setSuccessCount(successCount + 1)
      })
      .catch((error) => console.error(error))
  }

  const getCrop = (cropInfo) => {
    setCrop(cropInfo)
  }

  if (!user.auth) return null

  return (
    <div className={styles.AvatarTab}>
      {successCount > 0 && (
        <div className="notification is-success is-light">
          Successfully updated your avatar!
        </div>
      )}
      <Avatar userId={user.auth.uid} refresh={successCount} />
      {!uploading && (
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
      )}
      {inputFile && (
        <>
          <div className={styles.cropper}>
            <ImageCropper
              src={inputFile}
              loading={uploading}
              getCrop={getCrop}
            />
          </div>

          <button
            className="button is-primary"
            type="button"
            onClick={uploadAvatar}
            disabled={uploading}
          >
            Upload
          </button>
        </>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(withFirebase(AvatarTab))
