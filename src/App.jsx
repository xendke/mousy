import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { connect } from 'react-redux';
import { withFirebase } from './components/firebase';

import Home from './views/Home.jsx';
import Profile from './views/Profile.jsx';
import Join from './views/Join.jsx';
import LogIn from './views/LogIn.jsx';
import TopNav from './components/TopNav.jsx';
import { signIn, signOut, setInfo } from './redux/actions/user';

class App extends Component {
  componentDidMount() {
    const { firebase, dispatch } = this.props;

    firebase.auth.onAuthStateChanged(async (authUser) => {
      if(authUser) {
        dispatch(signIn(authUser));
        const userInfo = await firebase.doUserInfoGet(authUser.uid);
        dispatch(setInfo(userInfo.data()));
      } else {
        dispatch(signOut());
      }
    });
  }

  render() {
    return (
      <Router>
        <React.Fragment>
            <TopNav />
            <Route path="/" exact component={Home} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/login" exact component={LogIn} />
            <Route path="/join" exact component={Join} />
        </React.Fragment>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(withFirebase(App));
