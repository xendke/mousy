import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { Post, Comment } from '~/types/firebase/firestore'
import config from './firebase-auth'

const getCollectionData = (collectionRef) => {
  const data = []
  collectionRef.forEach((documentRef) => {
    const document = documentRef.data()
    data.push({ id: documentRef.id, ...document })
  })
  return data
}
const sortBy = (key) => (data) => {
  if (Array.isArray(data)) {
    return data.sort((a, b) => a[key] - b[key])
  }
  return []
}

class Firebase {
  auth: app.auth.Auth

  db: app.firestore.Firestore

  storage: app.storage.Storage

  constructor() {
    if (!app.apps.length) {
      app.initializeApp(config)
    } else {
      console.error('tried to init more than one firebase instance')
      return
    }

    this.auth = app.auth()
    this.db = app.firestore()
    this.storage = app.storage()
  }

  // *** Storage API ***

  doAvatarUrlGet = (userId: string) =>
    this.storage.ref(`avatars/${userId}`).getDownloadURL()

  doUploadUserAvatar = (userId: string, file: Blob) =>
    this.storage.ref(`avatars/${userId}`).put(file, { contentType: file.type })

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email: string, password: string) =>
    this.auth.createUserWithEmailAndPassword(email, password)

  doSignInWithEmailAndPassword = (email: string, password: string) =>
    this.auth.signInWithEmailAndPassword(email, password)

  doSignOut = () => this.auth.signOut()

  doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email)

  doPasswordUpdate = (password: string) =>
    this.auth.currentUser.updatePassword(password)

  // *** Firestore API ***

  doUsernameExistsCheck = (username: string) =>
    this.db.collection('usernames').doc(username).get()

  doUserInfoEdit = (
    uid: string,
    information // make interface for userInfo
  ) => this.db.collection('users').doc(uid).set(information)

  doUserInfoGet = (uid: string) => this.db.collection('users').doc(uid).get()

  doUsernameRegister = (username: string, uid: string) =>
    this.db.collection('usernames').doc(username).set({ uid })

  doLikedPostsGet = (likedPosts: string[] = []) =>
    likedPosts.length > 0
      ? this.db
          .collection('posts')
          .where(
            app.firestore.FieldPath.documentId(),
            'in',
            likedPosts.slice().reverse().slice(0, 10)
          )
          .get()
          .then(getCollectionData)
          .then(sortBy('createdAt'))
          .catch(() => [])
      : new Promise((resolve) => resolve([]))

  doUserPostsGet = (uid): Promise<Post[]> =>
    this.db
      .collection('posts')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get()
      .then(getCollectionData)

  doUserPostsAdd = (newPost) => this.db.collection('posts').add(newPost)

  doPostCommentAdd = (newComment) =>
    this.db.collection('comments').add(newComment)

  doCommentsGet = (postId: string): Promise<Comment[]> =>
    this.db
      .collection('comments')
      .where('postId', '==', postId)
      .orderBy('createdAt', 'desc')
      .get()
      .then(getCollectionData)

  doPostGet = (postId: string): Promise<Post> =>
    this.db
      .collection('posts')
      .doc(postId)
      .get()
      .then((postRef) => ({ id: postId, ...postRef.data() } as Post))

  doInterestsPostsGet = (interests: string[]): Promise<Post[]> =>
    this.db
      .collection('posts')
      .where('interests', 'array-contains-any', interests)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get()
      .then(getCollectionData)

  doPostLikeToggle = async (postId: string, uid: string) => {
    const doc = await this.db.collection('users').doc(uid)
    const self = (await doc.get()).data()

    const currentlyLikedPosts = self.likedPosts || []
    const likingPost = !currentlyLikedPosts.includes(postId)
    const newLikedPosts = likingPost
      ? currentlyLikedPosts.concat([postId])
      : currentlyLikedPosts.filter((id) => postId !== id)

    await doc
      .update({ likedPosts: newLikedPosts })
      .catch(() => ({ liked: !likingPost, likedPosts: currentlyLikedPosts }))

    return this.db
      .collection('posts')
      .doc(postId)
      .update({
        likeCount: app.firestore.FieldValue.increment(likingPost ? 1 : -1),
      })
      .then(() => ({ liked: likingPost, likedPosts: newLikedPosts }))
      .catch(() => ({ liked: !likingPost, likedPosts: currentlyLikedPosts }))
  }
}

export default Firebase
