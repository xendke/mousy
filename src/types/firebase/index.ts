import Firebase from '~/utils/firebase/firebase-app'

interface UserAuth {
  uid: string
}
interface UserInfo {
  username: string
  name: string
  email: string
  interests: string[]
  linkedPosts: string[]
}
export interface User {
  auth: UserAuth
  info: UserInfo
  isSignedIn: boolean
}

export type Userbase = Record<string, UserInfo & { lastFetchedAt: number }>

export default Firebase
