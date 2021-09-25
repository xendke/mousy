import 'bulma/css/bulma.css'
import 'normalize.css'
import { useMemo } from 'react'
import { Provider } from 'react-redux'
import { Footer, TopNav } from '~/components'
import Firebase, { FirebaseContext } from '~/components/firebase'
import store from '~/redux/store'
import { ScrollToTop } from '~/views'
import '../index.scss'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  const firebase = useMemo(() => new Firebase(), [])

  return (
    <>
      {/* <Head>
        <meta charset="utf-8" />
        <meta name="theme-color" content="#00D1B2" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="manifest" href="/manifest.json" />
        <title>Mousy</title>
        <meta
          name="description"
          content="Connect with people, not numbers. Join a community made just for you."
        />
      </Head> */}

      <Provider store={store}>
        <FirebaseContext.Provider value={firebase}>
          <ScrollToTop />
          <TopNav />
          <Component {...pageProps} />
          <Footer />
        </FirebaseContext.Provider>
      </Provider>
    </>
  )
}
