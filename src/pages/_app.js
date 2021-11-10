import 'bulma/css/bulma.css'
import 'normalize.css'
import '~/assets/index.scss'

import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Footer, TopNav } from '~/components'
import Firebase, { FirebaseContext, withFirebase } from '~/components/firebase'
import { wrapper } from '~/redux/store'
import { signIn, signOut, setInfo } from '~/redux/actions/user'
import { compose } from '~/utils'

const AuthListener = ({ children, firebase, dispatch }) => {
  useEffect(() => {
    if (!firebase) return
    const unsubscribe = firebase.auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        dispatch(signIn(authUser))
        const userInfo = await firebase.doUserInfoGet(authUser.uid)
        dispatch(setInfo(userInfo.data()))
      } else {
        dispatch(signOut())
      }
    })

    return () => unsubscribe()
  })

  return children
}

const AuthListenerWrapper = compose(
  connect(null, (dispatch) => ({ dispatch })),
  withFirebase
)(AuthListener)

function MyApp({ Component, pageProps, ...rest }) {
  const [firebase, setFirebase] = useState(null)

  useEffect(() => {
    const firebaseInstance = new Firebase()
    setFirebase(firebaseInstance)
  }, [])

  return (
    <FirebaseContext.Provider value={firebase}>
      <AuthListenerWrapper>
        <TopNav />
        <Component {...pageProps} />
        <Footer />
      </AuthListenerWrapper>
    </FirebaseContext.Provider>
  )
}

export default wrapper.withRedux(MyApp)
