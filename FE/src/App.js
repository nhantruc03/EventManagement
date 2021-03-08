import './App-ant.css';
// import './OldApp.css';
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './router/ScrollToTop';
import Routing from './router/routermodule';
class App extends Component {
  render() {
    return (
      <Router>
        <ScrollToTop>
          <Routing />
        </ScrollToTop>
      </Router>
    );
  }
}

export default App;










