import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Post, Loading, Avatar, Empty } from '~/components'
import { Action } from '~/components/Empty/Empty'
import { withFirebase } from '~/components/firebase'

import './Profile.scss'

const Profile = ({ user, firebase, match }) => {
  const { params } = match
  const [userData, setUserData] = useState({})
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)

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
      key={`${userData.username}_${createdAt}`}
      userFullName={userData.name}
      username={userData.username}
      content={content}
      createdAt={createdAt}
    />
  ))

  const isOwnProfile = params.userId === user.auth.uid || !params.userId

  const getContent = () => {
    if (loadingPosts) return <Loading />
    if (postsComponents.length > 0) return postsComponents
    const emptyActions = [<Action key="Feed" link="/" label="Feed" />]
    return (
      <Empty
        message="No posts yet. Try heading to the Feed to post your thoughts!"
        actions={emptyActions}
      />
    )
  }

  return (
    <section className="Profile container columns is-desktop">
      <div className="column is-one-quarter-desktop user-info">
        <div className="level">
          <div className="level-item">
            <figure className="image is-64x64">
              <Avatar userId={params.userId || user.auth.uid} />
            </figure>
          </div>
        </div>
        <h1 className="title has-text-centered is-capitalized">
          {userData.name}
        </h1>
        <h2 className="subtitle has-text-centered">
          # {userData.interests.join(', ')}
        </h2>
        {isOwnProfile && (
          <Link to="/account">
            <button
              type="button"
              className="button is-small is-primary is-inverted is-outlined"
            >
              <span className="icon is-small">
                <i className="fas fa-cog" />
              </span>
              <span>Edit</span>
            </button>
          </Link>
        )}
      </div>

      <div className="column">{getContent()}</div>
    </section>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(withFirebase(Profile))
