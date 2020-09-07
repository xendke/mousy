import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Post, Loading } from '../../components'
import { withFirebase } from '../../components/firebase'

import './Profile.scss'

const DEFAULT_AVATAR =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQCoxWc5ukrkkaNHBArZt7YJq15_xWWDb4NdQ&usqp=CAU'
const getAvatarUrl = (uid) =>
  `https://firebasestorage.googleapis.com/v0/b/shy-app-io.appspot.com/o/${uid}?alt=media&token=b67d4268-536a-4db7-835a-190d09856a25`

const Profile = ({ user, firebase, match }) => {
  const { params } = match
  const [userData, setUserData] = useState({})
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR)

  useEffect(() => {
    setAvatarUrl(getAvatarUrl(params.userId || user.auth.uid))
  }, [user.auth, params.userId])

  useEffect(() => {
    if (user.info && !params.userId) setUserData(user.info)
  }, [user.info, params.userId])

  useEffect(() => {
    if (!params.userId) return
    firebase.doUserInfoGet(params.userId).then((res) => {
      setUserData(res.data())
    })
  }, [params.userId, firebase])

  useEffect(() => {
    const iife = async () => {
      const postsCollection = await firebase.doUserPostsGet(
        params.userId || user.auth.uid
      )
      const newPosts = []

      postsCollection.forEach((post) => {
        newPosts.push(post.data())
      })
      setPosts(newPosts)
      setLoadingPosts(false)
    }
    iife()
  }, [user.auth, params.userId, firebase])

  if (!user.auth) {
    return <Loading />
  }

  if (!userData.name) return <Loading />

  const postsComponents = posts.map(({ content, createdAt }) => (
    <Post
      key={content}
      userFullName={userData.name}
      username={userData.username}
      content={content}
      createdAt={createdAt}
    />
  ))

  return (
    <section className="Profile container columns is-desktop">
      <div className="column is-one-quarter-desktop user-info">
        <div className="level">
          <div className="level-item">
            <figure className="image is-64x64">
              <img
                className="is-rounded"
                src={avatarUrl}
                onError={() => setAvatarUrl(DEFAULT_AVATAR)}
                alt="User Avatar"
              />
            </figure>
          </div>
        </div>
        <h1 className="title has-text-centered is-capitalized">
          {userData.name}
        </h1>
        <h2 className="subtitle has-text-centered">
          # {userData.interests.join(', ')}
        </h2>
      </div>

      <div className="column">
        {loadingPosts ? <Loading /> : postsComponents}
      </div>
    </section>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(withFirebase(Profile))
