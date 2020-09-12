import React, { useState, useEffect } from 'react'
import { withFirebase } from '../firebase'

const DEFAULT_AVATAR =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQCoxWc5ukrkkaNHBArZt7YJq15_xWWDb4NdQ&usqp=CAU'

const Avatar = ({ userId, refresh, firebase }) => {
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR)

  useEffect(() => {
    const iife = async () => {
      try {
        const url = await firebase.doAvatarUrlGet(userId)
        if (url) setAvatarUrl(url)
      } catch {
        setAvatarUrl(DEFAULT_AVATAR)
      }
    }
    iife()
  }, [userId, firebase, refresh])

  return (
    <figure className="Avatar image">
      <img className="is-rounded" src={avatarUrl} alt="User Avatar" />
    </figure>
  )
}

export default withFirebase(Avatar)
