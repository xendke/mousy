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
  const author = (
    <>
      <strong className="capitalize text-gray-700">{userFullName}</strong>
      <small className="text-gray-500"> @{username}</small>
    </>
  )

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 mb-3">
      <article className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div>
            <p>
              {userId ? (
                <Link href={userRoute}>{author}</Link>
              ) : (
                author
              )}
              <small className="text-gray-400"> {timePosted} ago</small>
              <br />
              {content}
            </p>
          </div>
          <nav className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              {!hideCommentIcon && (
                <Link href={`/post/${postId}`}>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(true)}
                className={cn(liked ? 'text-red-500' : '')}
              >
                <Heart className="h-3 w-3" />
                <span>{likeCount}</span>
              </Button>
            </div>
          </nav>
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
