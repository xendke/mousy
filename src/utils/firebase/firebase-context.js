import React from 'react'

const FirebaseContext = React.createContext(null)

export const withFirebase = (Component) => {
  const wrappedComponent = (props) => (
    <FirebaseContext.Consumer>
      {(firebase) => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
  )
  return wrappedComponent
}

export default FirebaseContext
