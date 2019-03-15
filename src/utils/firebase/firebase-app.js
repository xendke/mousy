import app from 'firebase/app';
import 'firebase/auth';
import config from './firebase-auth';

class Firebase {
  constructor() {
    if (!app.apps.length) {
      app.initializeApp(config);
    } else { console.log("tried to init more than one firebase"); return; }

    this.auth = app.auth();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
}

export default Firebase;