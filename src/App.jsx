import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { signIn, signOut, setInfo } from '~/redux/actions/user'
import { withFirebase } from '~/components/firebase'
import {
  // Home,
  // Profile,
  Account,
  // Join,
  // Login,
  PostDiscussion,
  // ScrollToTop,
} from '~/views'
import { TopNav, Footer } from '~/components'

class App extends Component {
  render() {
    const { user } = this.props
    return (
      <Router>
        <>
          {/* <ScrollToTop />
          <TopNav /> */}
          {/* <Route path="/" exact component={Home} /> */}
          {/* <Route path="/me" exact component={Profile} /> */}

          {/* TOOOODOOOO: */}
          <Route path="/account/:tab?" exact component={Account} />
          <Route path="/post/:postId?" exact component={PostDiscussion} />
          <Route
            path="/shy/:userId"
            component={({ match, ...props }) =>
              user.auth.uid === match.params.userId ? (
                <Redirect to="/me" />
              ) : (
                <Profile match={match} {...props} />
              )
            }
          />
          {/* <Route path="/login" exact component={Login} /> */}
          {/* <Route path="/join" exact component={Join} /> */}
          {/* <Footer /> */}
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
