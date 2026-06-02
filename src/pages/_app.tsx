import 'normalize.css'
import '~/assets/index.scss'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import Head from 'next/head'
import { Footer, TopNav } from '~/components'
import Firebase, { FirebaseContext, withFirebase } from '~/components/firebase'
import wrapper from '~/redux/store'
import { signIn, signOut, setInfo } from '~/redux/actions/user'
import { compose, noop } from '~/utils'

const AUTH_ROUTES = ['/login', '/join']

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
  const router = useRouter()
  const hideFooter = AUTH_ROUTES.includes(router.pathname)

  useEffect(() => {
    const firebaseInstance = new Firebase()
    setFirebase(firebaseInstance)
  }, [])

  return (
    <>
      <Head>
        <title>Mousy - Find humans like you</title>
        <meta name="theme-color" content="#00D1B2" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&display=swap" rel="stylesheet" />
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
          {!hideFooter && <Footer />}
        </AuthListenerWrapper>
      </FirebaseContext.Provider>
    </>
  )
}

export default wrapper.withRedux(MyApp)
