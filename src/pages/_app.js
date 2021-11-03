import 'bulma/css/bulma.css'
// import withRedux from 'next-redux-wrapper'
// import App from 'next/app'
import 'normalize.css'
import { useEffect, useMemo } from 'react'
// import { Provider } from 'react-redux'
import { Footer, TopNav } from '~/components'
import Firebase, { FirebaseContext } from '~/components/firebase'
import { wrapper } from '~/redux/store'
import { ScrollToTop } from '~/views'
import '../index.scss'

// This default export is required in a new `pages/_app.js` file.
// function MyApp({ Component, pageProps }) {
//   const firebase = useMemo(() => new Firebase(), [])

//   return (
//     <>
//       {/* <Head>
//         <meta charset="utf-8" />
//         <meta name="theme-color" content="#00D1B2" />
//         <link rel="shortcut icon" href="/favicon.ico" />
//         <meta
//           name="viewport"
//           content="width=device-width, initial-scale=1, shrink-to-fit=no"
//         />
//         <link rel="manifest" href="/manifest.json" />
//         <title>Mousy</title>
//         <meta
//           name="description"
//           content="Connect with people, not numbers. Join a community made just for you."
//         />
//       </Head> */}

//       <Provider store={store}>
//         <FirebaseContext.Provider value={firebase}>
//           <ScrollToTop />
//           <TopNav />
//           <Component {...pageProps} />
//           <Footer />
//         </FirebaseContext.Provider>
//       </Provider>
//     </>
//   )
// }

// class MyApp extends App {
//   static async getInitialProps({ Component, ctx }) {
//     const pageProps = Component.getInitialProps
//       ? await Component.getInitialProps(ctx)
//       : {}

//     //Anything returned here can be accessed by the client
//     return { pageProps: pageProps }
//   }

//   render() {
//     //pageProps that were returned  from 'getInitialProps' are stored in the props i.e. pageprops
//     const { Component, pageProps, store } = this.props

//     return (
//       <Provider store={store}>
//         <FirebaseContext.Provider value={new Firebase()}>
//           <ScrollToTop />
//           <TopNav />
//           <Component {...pageProps} />
//           <Footer />
//         </FirebaseContext.Provider>
//       </Provider>
//     )
//   }
// }

// export default withRedux(makeStore)(MyApp)

function MyApp({ Component, pageProps, store, ...rest }) {
  const firebase = useMemo(() => new Firebase(), [])
  useEffect(() => {
    if (firebase && firebase.auth && store) {
      firebase.auth.onAuthStateChanged(async (authUser) => {
        console.log('HERE')
        if (authUser) {
          store.dispatch(signIn(authUser))
          const userInfo = await firebase.doUserInfoGet(authUser.uid)
          store.dispatch(setInfo(userInfo.data()))
        } else {
          store.dispatch(signOut())
        }
      })
    }
  }, [firebase, store])
  return (
    <FirebaseContext.Provider value={firebase}>
      <ScrollToTop />
      <TopNav />
      <Component {...pageProps} />
      <Footer />
    </FirebaseContext.Provider>
  )
}

export default wrapper.withRedux(MyApp)
