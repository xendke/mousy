import 'bulma/css/bulma.css'
import 'normalize.css'
import '~/assets/index.scss'

import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Head from 'next/head'
import { Footer, TopNav } from '~/components'
import Firebase, { FirebaseContext, withFirebase } from '~/components/firebase'
import { wrapper } from '~/redux/store'
import { signIn, signOut, setInfo } from '~/redux/actions/user'
import { compose, noop } from '~/utils'

const AuthListener = ({ children, firebase, dispatch }) => {
  useEffect(() => {
    if (!firebase) return noop

    const unsubscribe = firebase.auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        dispatch(signIn(authUser))
        const userInfo = await firebase.doUserInfoGet(authUser.uid)
        dispatch(setInfo(userInfo.data()))
      } else {
        dispatch(signOut())
      }
    })

    return unsubscribe
  })

  return children
}

const AuthListenerWrapper = compose(
  connect(null, (dispatch) => ({ dispatch })),
  withFirebase
)(AuthListener)

function MyApp({ Component, pageProps }) {
  const [firebase, setFirebase] = useState<Firebase | null>(null)

  useEffect(() => {
    const firebaseInstance = new Firebase()
    setFirebase(firebaseInstance)
  }, [])

  return (
    <>
      <Head>
        <title>Mousy - Find humans like you</title>
        <meta name="theme-color" content="#00D1B2" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="description"
          content="Connect with people, not numbers. Join a community tailored for you."
        />
      </Head>
      <FirebaseContext.Provider value={firebase}>
        <AuthListenerWrapper>
          <TopNav />
          <Component {...pageProps} />
          <Footer />
        </AuthListenerWrapper>
      </FirebaseContext.Provider>
    </>
  )
}

export default wrapper.withRedux(MyApp)
