import React from 'react'
import { connect } from 'react-redux'
import { Loading, Post, PostForm } from '~/components'
import { withFirebase } from '~/components/firebase'
import { setUserbaseInfo } from '~/redux/actions/userbase'
import personImage from '~/assets/person.png'
import { logger } from '~/utils'

import './Home.scss'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      loadingPosts: true,
    }
  }

  componentDidMount() {
    const { firebase, userbase, user, dispatch } = this.props

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
        const shouldFetchUserData =
          userId !== user.auth.uid ||
          !userbase[userId] ||
          !userbase[userId].lastFetchedAt ||
          Date.now() - userbase[userId].lastFetchedAt > 1800000

        if (shouldFetchUserData) {
          logger('fetching userbase info')
          firebase.doUserInfoGet(userId).then((userInfo) => {
            dispatch(
              setUserbaseInfo(userId, {
                ...userInfo.data(),
                lastFetchedAt: Date.now(),
              })
            )
          })
        }
      })

      this.setState(() => ({
        posts: newPosts,
        loadingPosts: false,
      }))
    }
    const shouldFetchFeed =
      user.isSignedIn &&
      user.auth.uid &&
      user.info.interests &&
      user.info.interests.length > 0

    if (shouldFetchFeed) getFeed()
  }

  render() {
    const { posts, loadingPosts } = this.state
    const { user, userbase } = this.props

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
      let userInfo = {}
      if (userId === user.auth.uid) {
        userInfo = user.info
      } else {
        userInfo = userbase[userId] || {
          name: 'Loading User',
          username: 'loading',
        }
      }

      return (
        <Post
          key={`${userInfo.username}_${createdAt}`}
          userFullName={userInfo.name}
          username={userInfo.username}
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
}

const mapStateToProps = (state) => ({
  user: state.user,
  userbase: state.userbase,
})

export default connect(mapStateToProps)(withFirebase(Home))
