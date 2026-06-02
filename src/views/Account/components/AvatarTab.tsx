import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Avatar, ImageCropper } from '~/components'
import { withFirebase } from '~/components/firebase'
import getCroppedImg from '~/components/ImageCropper/helpers'
import { Firebase, User } from '~/types'
import { Alert } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'

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
    <div className="space-y-4 py-4">
      {successCount > 0 && (
        <Alert variant="success">Successfully updated your avatar!</Alert>
      )}
      <Avatar userId={user.auth.uid} refresh={successCount} />
      {!uploading && (
        <label htmlFor="fileInput" className="inline-flex cursor-pointer items-center rounded-full border-2 border-black bg-black px-5 py-2 text-sm font-bold text-white hover:bg-black/80">
          Choose a File
          <input
            className="sr-only"
            id="fileInput"
            type="file"
            onChange={(e) => onChangePicture(e)}
            accept="image/*"
          />
        </label>
      )}
      {inputFile && (
        <>
          <div className="overflow-hidden rounded-xl">
            <ImageCropper
              src={inputFile}
              loading={uploading}
              getCrop={getCrop}
            />
          </div>

          <Button
            type="button"
            onClick={uploadAvatar}
            disabled={uploading}
          >
            Upload
          </Button>
        </>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(withFirebase(AvatarTab))
