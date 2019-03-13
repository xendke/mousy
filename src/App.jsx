import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from './views/Home.jsx';
import Profile from './views/Profile.jsx';

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Route path="/" exact component={Home} />
          <Route path="/profile" exact component={Profile} />
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
