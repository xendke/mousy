import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import * as serviceWorker from './serviceWorker'
import Firebase, { FirebaseContext } from './components/firebase'
import App from './App'

import 'normalize.css'
import './index.scss'
import 'bulma/css/bulma.css'
import 'react-image-crop/lib/ReactCrop.scss'

ReactDOM.render(
  <Provider store={store}>
    <FirebaseContext.Provider value={new Firebase()}>
      <App />
    </FirebaseContext.Provider>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
