import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Loading, Post, PostForm } from '../../components'
import { withFirebase } from '../../components/firebase'
import { setUserbaseInfo } from '../../redux/actions/userbase'
import personImage from '../../assets/person.png'

import './Home.scss'

const Home = ({ userbase, user, firebase, dispatch }) => {
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  useEffect(() => {
    const getFeed = async () => {
      const postsCollection = await firebase.doInterestsPostsGet(
        user.info.interests
      )
      const newPosts = []
      postsCollection.forEach((postRef) => {
        const post = postRef.data()
        newPosts.push(post)
      })

      const uniqueUsers = [...new Set(newPosts.map((post) => post.userId))]
      uniqueUsers.forEach((userId) => {
        if (!userbase[userId]) {
          firebase.doUserInfoGet(userId).then((userInfo) => {
            dispatch(setUserbaseInfo(userId, userInfo.data()))
          })
        }
      })

      setPosts(newPosts)
      setLoadingPosts(false)
    }
    if (user.info.interests && user.info.interests.length > 0) getFeed()
  }, [dispatch, firebase, userbase, user.info])

  if (!user.auth && user.isSignedIn) return <Loading />

  if (!user.isSignedIn) {
    return (
      <div className="the-fold columns">
        <div className="fold-text column">
          <h1>Don&apos;t Be Shy!</h1>
          <p>Connect with people like you.</p>
        </div>
        <div className="fold-image column">
          <img
            src={personImage}
            alt="Digitally rendered human sitting with pets."
          />
        </div>
      </div>
    )
  }

  const userData = user && user.info

  const postsComponents = posts.map(({ content, userId, createdAt }) => {
    const userOrLoading = userbase[userId] || {
      name: 'Loading User',
      username: 'loading',
    }
    return (
      <Post
        key={`${userOrLoading.username}_${createdAt}`}
        userFullName={userOrLoading.name}
        username={userOrLoading.username}
        userId={userId}
        content={content}
        createdAt={createdAt}
      />
    )
  })

  if (userData) {
    return (
      <div className="Feed">
        <PostForm />
        <h1 className="title is-medium">Feed</h1>
        {loadingPosts ? <Loading /> : postsComponents}
      </div>
    )
  }
  return null
}

const mapStateToProps = (state) => ({
  user: state.user,
  userbase: state.userbase,
})

export default connect(mapStateToProps)(withFirebase(Home))
