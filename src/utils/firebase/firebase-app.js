import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import config from './firebase-auth'

const getCollectionData = (collectionRef) => {
  const data = []
  collectionRef.forEach((documentRef) => {
    const document = documentRef.data()
    data.push({ id: documentRef.id, ...document })
  })
  return data
}

class Firebase {
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

  doAvatarUrlGet = (userId) =>
    this.storage.ref(`avatars/${userId}`).getDownloadURL()

  doUploadUserAvatar = (userId, file) =>
    this.storage.ref(`avatars/${userId}`).put(file, { contentType: file.type })

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)

  doSignOut = () => this.auth.signOut()

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email)

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password)

  // *** Firestore API ***

  doUsernameExistsCheck = (username) =>
    this.db.collection('usernames').doc(username).get()

  doUserInfoEdit = (uid, information) =>
    this.db.collection('users').doc(uid).set(information)

  doUserInfoGet = (uid) => this.db.collection('users').doc(uid).get()

  doUsernameRegister = (username, uid) =>
    this.db.collection('usernames').doc(username).set({ uid })

  doUserPostsGet = (uid) =>
    this.db
      .collection('posts')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .get()
      .then(getCollectionData)

  doUserPostsAdd = (newPost) => this.db.collection('posts').add(newPost)

  doInterestsPostsGet = (interests) =>
    this.db
      .collection('posts')
      .where('interests', 'array-contains-any', interests)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get()
      .then(getCollectionData)

  doPostLikeToggle = async (postId, uid) => {
    const doc = await this.db.collection('users').doc(uid)
    const self = (await doc.get()).data()

    const currentlyLikedPosts = self.likedPosts || []
    const likingPost = !currentlyLikedPosts.includes(postId)
    const newLikedPosts = likingPost
      ? currentlyLikedPosts.concat([postId])
      : currentlyLikedPosts.filter((id) => postId !== id)

    await doc
      .update({ likedPosts: newLikedPosts })
      .catch(() => ({ liked: !likingPost }))

    return this.db
      .collection('posts')
      .doc(postId)
      .update({
        likeCount: app.firestore.FieldValue.increment(likingPost ? 1 : -1),
      })
      .then(() => ({ liked: likingPost }))
      .catch(() => ({ liked: !likingPost }))
  }

  doUserLikedPostsGet = (postId, uid) =>
    this.db.collection('users').doc(uid).collection('liked_posts').get()
}

export default Firebase
