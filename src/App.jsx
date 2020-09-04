import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { signIn, signOut, setInfo } from './redux/actions/user'
import { withFirebase } from './components/firebase'
import { Home, Profile, Join, Login } from './views'
import { TopNav, Footer } from './components'

class App extends Component {
  componentDidMount() {
    const { firebase, dispatch } = this.props

    firebase.auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        dispatch(signIn(authUser))
        const userInfo = await firebase.doUserInfoGet(authUser.uid)
        dispatch(setInfo(userInfo.data()))
      } else {
        dispatch(signOut())
      }
    })
  }

  render() {
    return (
      <Router>
        <>
          <TopNav />
          <Route path="/" exact component={Home} />
          <Route path="/me" exact component={Profile} />
          <Route path="/shy/:userId" component={Profile} />
          <Route path="/login" exact component={Login} />
          <Route path="/join" exact component={Join} />
          <Footer />
        </>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(withFirebase(App))
