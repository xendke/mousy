import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from './views/Home.jsx';
import Profile from './views/Profile.jsx';
import Join from './views/Join.jsx';
import LogIn from './views/LogIn.jsx';
import TopNav from './components/TopNav.jsx';

class App extends Component {
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

export default App;
