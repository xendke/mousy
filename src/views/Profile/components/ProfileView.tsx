import React, { useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faHeart, faCog } from '@fortawesome/free-solid-svg-icons'

import cn from 'classnames'
import { Post, Loading, Avatar, Empty } from '~/components'
import { Action } from '~/components/Empty/Empty'

import styles from './ProfileView.module.scss'
import { Post as PostInt, User, Userbase } from '~/types'

interface ProfileViewProps {
  user: User
  isOwnProfile: boolean
  userId: string
  userData: User['info'] & { userNotAvailable: boolean; error: boolean }
  userbase: Userbase
  posts: PostInt[]
  loadingPosts: boolean
  showingLikes: boolean
  showLikes: (b: boolean) => void
  // router: Router
}

// const shouldRedirectToLogin = (auth, userData = {}) => !auth || userData.error

const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  isOwnProfile,
  userId,
  userData,
  userbase,
  posts,
  loadingPosts,
  showingLikes,
  showLikes,
  // router,
}) => {
  useEffect(() => {
    // if (shouldRedirectToLogin(user.auth, userData)) {
    //   return Router.push('/login')
    // }
  }, [])

  if (!user.auth || !userData) {
    return <Loading />
  }

  const likedPosts = userData.likedPosts ? userData.likedPosts : []

  const getPostAuthor = (authorId) => {
    if (userData.userNotAvailable) {
      return { name: 'Deleted', username: 'deleted' }
    }

    if ((isOwnProfile && !showingLikes) || !isOwnProfile) {
      return userData
    }

    const userFromCache = userbase[authorId]

    return userFromCache || { name: 'Loading', username: 'loading' }
  }

  const postsComponents = posts.map(
    ({ id, content, createdAt, likeCount, userId: authorId }) => {
      const author = getPostAuthor(authorId)

      console.log('author', author)
      return (
        <Post
          key={id}
          userId={authorId}
          postId={id}
          userFullName={author.name}
          username={author.username}
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
    const emptyActions = [<Action key="Feed" link="/" label="Feed" />]
    const message = showingLikes
      ? 'No posts here. Try heading to the Feed to like some posts!'
      : 'No posts yet. Try heading to the Feed to post your thoughts!'
    return <Empty message={message} actions={emptyActions} />
  }

  const { userNotAvailable, name, interests } = userData

  return (
    <section
      className={cn(
        styles.Profile,
        styles.container,
        'container columns is-desktop'
      )}
    >
      <div className={cn(styles.userInfo, 'column is-one-quarter-desktop')}>
        <div className="level">
          <div className="level-item">
            <figure className="image is-64x64">
              <Avatar userId={userId} />
            </figure>
          </div>
        </div>
        <h1 className="title has-text-centered is-capitalized">
          {userNotAvailable ? 'Deleted User' : name}
        </h1>
        <h2 className="subtitle has-text-centered">
          {interests && interests.length > 0
            ? `# ${interests.join(', ')}`
            : null}
        </h2>
        {isOwnProfile && (
          <>
            <Link href="/account" passHref>
              <a href="wow">
                <button
                  type="button"
                  className={cn(
                    styles.button,
                    'button is-small is-primary is-inverted is-outlined'
                  )}
                >
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faCog} />
                  </span>
                  <span>Edit</span>
                </button>
              </a>
            </Link>

            <div className={cn(styles.box, 'box')}>
              <div className="buttons has-addons is-centered is-expanded">
                <button
                  type="button"
                  className={`button ${
                    !showingLikes ? 'is-primary is-selected' : ''
                  }`}
                  onClick={() => showLikes(false)}
                >
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faComment} />
                  </span>
                  <span>Posts</span>
                </button>
                <button
                  type="button"
                  className={`button ${
                    showingLikes ? 'is-primary is-selected' : ''
                  }`}
                  onClick={() => showLikes(true)}
                >
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faHeart} />
                  </span>
                  <span>Likes</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="column">{getContent()}</div>
    </section>
  )
}

export default ProfileView
