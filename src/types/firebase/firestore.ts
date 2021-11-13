interface UserAuth {
  uid: string
}
interface UserInfo {
  username: string
  name: string
  email: string
  interests: string[]
  likedPosts: string[]
}
export interface User {
  auth: UserAuth
  info: UserInfo
  isSignedIn: boolean
}

export interface Post {
  content: string
  createdAt: number
  id: string
  interests: string[]
  likeCount: number
  userId: string
}

export interface Comment {
  content: string
  createdAt: number
  id: string
  postId: string
  userId: string
}

export type Userbase = Record<string, UserInfo & { lastFetchedAt: number }>
