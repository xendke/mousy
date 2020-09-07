import React, { useState, useEffect } from 'react'
// import './Loading.scss'

const DEFAULT_AVATAR =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQCoxWc5ukrkkaNHBArZt7YJq15_xWWDb4NdQ&usqp=CAU'
const getAvatarUrl = (uid) =>
  `https://firebasestorage.googleapis.com/v0/b/shy-app-io.appspot.com/o/${uid}?alt=media`

const Avatar = ({ userId }) => {
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR)

  useEffect(() => {
    setAvatarUrl(getAvatarUrl(userId))
  }, [userId])

  return (
    <img
      className="is-rounded"
      src={avatarUrl}
      onError={() => setAvatarUrl(DEFAULT_AVATAR)}
      alt="User Avatar"
    />
  )
}

export default Avatar
