import React from 'react'
import { MessageSquare, Heart } from 'lucide-react'
import Link from 'next/link'
import { withEffects, toProps } from 'refract-xstream'
import { formatDistanceToNowStrict } from 'date-fns'
import xs from 'xstream'
import { connect } from 'react-redux'
import { cn } from '~/lib/utils'
import { compose } from '~/utils'
import { withFirebase } from '~/components/firebase'
import { setLikedPosts } from '~/redux/actions/user'
import { Button } from '~/components/ui/button'

interface PostProps {
  postId: string
  userFullName: string
  username: string
  userId: string
  content: string
  createdAt: number
  likeCount: number
  onLike: (l: boolean) => void
  liked: boolean
  hideCommentIcon: boolean
  uid: string
}

const TOPIC_COLORS = ['#fce6d7', '#d8edfe', '#d3efe7', '#e6e2f8']

function postColor(postId: string): string {
  let hash = 0
  for (let i = 0; i < postId.length; i++) hash = (hash * 31 + postId.charCodeAt(i)) >>> 0
  return TOPIC_COLORS[hash % TOPIC_COLORS.length]
}

const Post: React.FC<PostProps> = ({
  postId,
  userFullName,
  username,
  userId,
  content,
  createdAt,
  likeCount,
  onLike,
  liked,
  hideCommentIcon,
  uid,
}) => {
  const timePosted = formatDistanceToNowStrict(createdAt)
  const userRoute = uid === userId ? '/me' : `/shy/${userId}`
  const initial = (userFullName || username || '?')[0].toUpperCase()
  const bg = postColor(postId)

  return (
    <div className="rounded-2xl border-2 border-black p-5 mb-3" style={{ background: bg }}>
      <article>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-bold text-base"
            style={{ background: '#fff', fontFamily: '"Archivo", sans-serif' }}
          >
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            {userId ? (
              <Link href={userRoute} className="hover:underline">
                <span className="font-bold text-sm capitalize" style={{ color: '#181f2a' }}>{userFullName}</span>
                <span className="text-gray-500 text-sm ml-1">@{username}</span>
              </Link>
            ) : (
              <>
                <span className="font-bold text-sm capitalize" style={{ color: '#181f2a' }}>{userFullName}</span>
                <span className="text-gray-500 text-sm ml-1">@{username}</span>
              </>
            )}
            <span className="text-gray-400 text-xs ml-1">{timePosted} ago</span>
          </div>
        </div>
        <p className="text-base leading-relaxed mb-3" style={{ color: '#181f2a' }}>{content}</p>
        <div className="flex items-center gap-4" style={{ color: '#5b616b' }}>
          {!hideCommentIcon && (
            <Link href={`/post/${postId}`}>
              <button type="button" className="flex items-center gap-2 font-bold text-sm hover:text-black transition-colors">
                <MessageSquare className="h-5 w-5" />
              </button>
            </Link>
          )}
          <button
            type="button"
            className={cn('flex items-center gap-2 font-bold text-sm transition-colors', liked ? 'text-red-500' : 'hover:text-black')}
            onClick={() => onLike(true)}
          >
            <Heart className={cn('h-5 w-5', liked ? 'fill-red-500' : '')} />
            <span>{likeCount}</span>
          </button>
        </div>
      </article>
    </div>
  )
}

const aperture = (
  component,
  { likeCount, firebase, postId, user, dispatch }
) => {
  const [postLiked$, onLike] = component.useEvent('likePost')
  const { uid } = user.auth

  return xs
    .merge(
      postLiked$
        .filter((value) => value && postId)
        .map(() => xs.fromPromise(firebase.doPostLikeToggle(postId, uid)))
        .flatten()
        .map(({ liked, likedPosts }) => {
          dispatch(setLikedPosts(likedPosts))
          return liked
        })
        .fold(
          (previous, liked) => ({
            likeCount: liked ? previous.likeCount + 1 : previous.likeCount - 1,
            liked,
          }),
          { likeCount: likeCount || 0 }
        ),
      postLiked$.mapTo({
        onLike,
        uid,
      })
    )
    .map(toProps)
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default compose(
  connect(mapStateToProps),
  withFirebase,
  withEffects(aperture, { mergeProps: true })
)(Post)
