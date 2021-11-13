import React from 'react'
import { Firebase } from '~/types'

const FirebaseContext = React.createContext<Firebase | null>(null)
FirebaseContext.displayName = 'FirebaseContext'

const FirebaseConsumer = FirebaseContext.Consumer

export const withFirebase = (Component: typeof React.Component | React.FC) => {
  const wrappedComponent = (props) => {
    return (
      <FirebaseConsumer>
        {(firebase) => <Component {...props} firebase={firebase} />}
      </FirebaseConsumer>
    )
  }
  return wrappedComponent
}

export default FirebaseContext
