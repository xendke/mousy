import React from 'react'
import xs from 'xstream'
import sampleCombine from 'xstream/extra/sampleCombine'
import { withEffects, toProps } from 'refract-xstream'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { compose } from '~/utils'
import { Post, Loading, Avatar, Empty } from '~/components'
import { Action } from '~/components/Empty/Empty'
import { withFirebase } from '~/components/firebase'

import './Profile.scss'

const Profile = ({
  user,
  isOwnProfile,
  userId,
  userData,
  posts,
  loadingPosts,
}) => {
  // const [, setPosts] = useState([])
  // const [, setLoadingPosts] = useState(true)
  // useEffect(() => {
  //   const iife = async () => {
  //     const postsCollection = await firebase.doUserPostsGet(
  //       params.userId || user.auth.uid
  //     )
  //     const newPosts = []
  //
  //     postsCollection.forEach((post) => {
  //       newPosts.push(post.data())
  //     })
  //     setPosts(newPosts)
  //     setLoadingPosts(false)
  //   }
  //   iife()
  // }, [user.auth, params.userId, firebase])

  if (!user.auth) {
    return <Loading />
  }

  if (!userData) return <Loading />

  const postsComponents = posts.map(({ content, createdAt }) => (
    <Post
      key={`${userData.username}_${createdAt}`}
      userFullName={userData.name}
      username={userData.username}
      content={content}
      createdAt={createdAt}
    />
  ))

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
              <Avatar userId={userId} />
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

const aperture = (component, { firebase, user }) => {
  const userIdParam = () =>
    component.observe('match', ({ params }) => params.userId)

  const loadOtherUserInfo$ = userIdParam()
    .filter((param) => param)
    .map((userId) =>
      xs.fromPromise(firebase.doUserInfoGet(userId).then((res) => res.data()))
    )
    .flatten()
    .compose(
      sampleCombine(component.observe('match', ({ params }) => params.userId))
    )
    .map(([userData, userId]) => ({ userData, isOwnProfile: false, userId }))

  const noUserIdParam$ = userIdParam()
    .filter((param) => !param)
    .mapTo({ userData: user.info, isOwnProfile: true, userId: user.auth.uid })

  return xs
    .merge(noUserIdParam$, loadOtherUserInfo$)
    .startWith({ posts: [], loadingPosts: true })
    .map(toProps)
}

export default compose(
  connect(mapStateToProps),
  withFirebase,
  withEffects(aperture, { mergeProps: true })
)(Profile)
