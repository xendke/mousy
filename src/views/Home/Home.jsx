import React from 'react'
import { connect } from 'react-redux'
import { Loading, Post, PostForm, Empty } from '~/components'
import { Action } from '~/components/Empty/Empty'
import { withFirebase } from '~/components/firebase'
import { setUserbaseInfo } from '~/redux/actions/userbase'
import { setInterestsPosts } from '~/redux/actions/posts'
import Landing from './Landing'

import './Home.scss'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingPosts: true,
    }
  }

  componentDidMount() {
    const { isSignedIn, auth, userInfo } = this.props

    const shouldFetchFeed =
      isSignedIn &&
      auth.uid &&
      userInfo.interests &&
      userInfo.interests.length > 0

    if (shouldFetchFeed) this.getFeed()
  }

  componentDidUpdate(prevProps) {
    const { isSignedIn, auth, userInfo } = this.props

    const shouldFetchFeed =
      userInfo &&
      userInfo.username !== prevProps.userInfo.username &&
      isSignedIn &&
      auth.uid &&
      userInfo.interests &&
      userInfo.interests.length > 0

    if (shouldFetchFeed) this.getFeed()
  }

  getFeed = async () => {
    const { firebase, userbase, auth, userInfo, dispatch } = this.props

    const newPosts = await firebase.doInterestsPostsGet(userInfo.interests)

    const uniqueUsers = [...new Set(newPosts.map((post) => post.userId))]
    uniqueUsers.forEach((userId) => {
      const cacheExists = userbase[userId] && userbase[userId].lastFetchedAt
      const shouldFetchUserData =
        userId !== auth.uid ||
        (cacheExists && Date.now() - userbase[userId].lastFetchedAt > 1800000)

      if (shouldFetchUserData) {
        firebase.doUserInfoGet(userId).then((otherUser) => {
          dispatch(
            setUserbaseInfo(userId, {
              ...otherUser.data(),
              lastFetchedAt: Date.now(),
            })
          )
        })
      }
    })

    dispatch(setInterestsPosts(newPosts))
    this.setState(() => ({
      loadingPosts: false,
    }))
  }

  render() {
    const { loadingPosts } = this.state
    const { posts } = this.props
    const { auth, isSignedIn, userInfo, userbase } = this.props

    if (!isSignedIn) {
      return <Landing />
    }

    const postsComponents = posts.map(
      ({ id, content, userId, createdAt, likeCount }) => {
        let userData = {}
        if (userId === auth.uid) {
          userData = { ...userInfo }
        } else {
          userData = userbase[userId] || {
            name: 'Loading User',
            username: 'loading',
          }
        }

        const likedPosts = userInfo.likedPosts || []

        return (
          <Post
            key={id}
            postId={id}
            userFullName={userData.name}
            username={userData.username}
            userId={userId}
            content={content}
            createdAt={createdAt}
            likeCount={likeCount}
            liked={likedPosts.includes(id)}
          />
        )
      }
    )

    const getContent = () => {
      if (loadingPosts) return <Loading />
      if (postsComponents.length > 0) return postsComponents
      const actions = [
        <Action key="Account" link="/account/interests" label="Account" />,
      ]
      return (
        <Empty
          message="No posts here. Try adding more of your interests!"
          actions={actions}
        />
      )
    }

    if (userInfo) {
      return (
        <div className="Feed">
          <PostForm getFeed={this.getFeed} />
          <h1 className="title is-medium">Feed</h1>
          {getContent()}
        </div>
      )
    }
    return null
  }
}

const mapStateToProps = (state) => ({
  isSignedIn: state.user.isSignedIn,
  auth: state.user.auth,
  userInfo: state.user.info,
  userbase: state.userbase,
  posts: state.posts.fromInterests,
})

export default connect(mapStateToProps)(withFirebase(Home))
