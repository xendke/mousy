import React, { useState, useEffect, FC } from 'react'
import Image from 'next/image'
import { withFirebase } from '~/components/firebase'
import { Firebase } from '~/types'

const DEFAULT_AVATAR =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQCoxWc5ukrkkaNHBArZt7YJq15_xWWDb4NdQ&usqp=CAU'

interface AvatarProps {
  userId: string
  refresh: number
  firebase: Firebase
}

const Avatar: FC<AvatarProps> = ({ userId, refresh, firebase }) => {
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR)

  useEffect(() => {
    const iife = async () => {
      try {
        const url = await firebase.doAvatarUrlGet(userId)
        if (url) setAvatarUrl(url)
      } catch (e) {
        setAvatarUrl(DEFAULT_AVATAR)
      }
    }
    iife()
  }, [userId, firebase, refresh])

  return (
    <figure className="Avatar image">
      <Image
        className="is-rounded"
        src={avatarUrl}
        alt="User Avatar"
        width={100}
        height={100}
        // layout="fill"
      />
    </figure>
  )
}

export default withFirebase(Avatar)
