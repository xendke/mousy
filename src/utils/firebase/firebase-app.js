import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import config from './firebase-auth'

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

  doUserPostsAdd = (newPost) => this.db.collection('posts').add(newPost)

  doInterestsPostsGet = (interests) =>
    this.db
      .collection('posts')
      .where('interests', 'array-contains-any', interests)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get()

  doUserLikedPostsGet = (postId, uid) =>
    this.db.collection('users').doc(uid).collection('liked_posts').get()
}

export default Firebase
