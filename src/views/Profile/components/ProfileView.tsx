import React, { useEffect } from 'react'
import Link from 'next/link'
import { MessageSquare, Heart, Settings } from 'lucide-react'

import { Post, Loading, Avatar, Empty } from '~/components'
import { Action } from '~/components/Empty/Empty'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

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
}

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
}) => {
  useEffect(() => {}, [])

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
    <section className="max-w-5xl mx-auto px-4 py-8 md:flex md:gap-8">
      <div className="md:w-64 shrink-0 mb-6 md:mb-0">
        <div className="flex justify-center mb-4">
          <Avatar userId={userId} />
        </div>
        <h1 className="text-xl font-bold text-center capitalize text-gray-900">
          {userNotAvailable ? 'Deleted User' : name}
        </h1>
        <h2 className="text-sm text-center text-gray-500 mt-1">
          {interests && interests.length > 0
            ? `# ${interests.join(', ')}`
            : null}
        </h2>
        {isOwnProfile && (
          <>
            <div className="flex justify-center mt-4">
              <Link href="/account">
                <Button variant="outline" size="sm">
                  <Settings className="h-3 w-3" />
                  Edit
                </Button>
              </Link>
            </div>

            <div className="mt-4 rounded-2xl bg-white shadow-sm border border-gray-100 p-3">
              <div className="flex">
                <button
                  type="button"
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition-colors',
                    !showingLikes
                      ? 'bg-brand text-white'
                      : 'text-gray-500 hover:bg-gray-50'
                  )}
                  onClick={() => showLikes(false)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Posts
                </button>
                <button
                  type="button"
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition-colors',
                    showingLikes
                      ? 'bg-brand text-white'
                      : 'text-gray-500 hover:bg-gray-50'
                  )}
                  onClick={() => showLikes(true)}
                >
                  <Heart className="h-4 w-4" />
                  Likes
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex-1">{getContent()}</div>
    </section>
  )
}

export default ProfileView
