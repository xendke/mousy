import 'bulma/css/bulma.css'
import 'normalize.css'
import { useEffect, useState } from 'react'
import { Footer, TopNav } from '~/components'
import Firebase, { FirebaseContext } from '~/components/firebase'
import { wrapper } from '~/redux/store'
import { ScrollToTop } from '~/views'
import '../index.scss'

function MyApp({ Component, pageProps, store, ...rest }) {
  const [firebase, setFirebase] = useState(null)

  useEffect(() => {
    const firebaseInstance = new Firebase()
    setFirebase(firebaseInstance)
  }, [])

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
