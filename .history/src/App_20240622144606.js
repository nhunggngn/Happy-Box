import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './App.css';
import CreateBox from './CreateBox';
import ClaimBox from './ClaimBox';

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Happy Box</h1>
        </header>
        <nav>
          <ul>
            <li>
              <Link to="/create">Create Box</Link>
            </li>
            <li>
              <Link to="/claim">Claim Box</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/create">
            <CreateBox />
          </Route>
          <Route path="/claim">
            <ClaimBox />
          </Route>
          <Route path="/">
            <Redirect to="/create" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
