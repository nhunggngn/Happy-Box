import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CreateBox from './CreateBox';
import ClaimBox from './ClaimBox';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create" component={CreateBox} />
        <Route path="/claim/:boxId" component={ClaimBox} />
        <Route path="/" exact component={HomePage} />
      </Switch>
    </Router>
  );
};

const HomePage = () => (
  <div>
    <h1>Welcome to Gift Box DApp</h1>
    <a href="/create">Create a Gift Box</a>
    <br />
    <a href="/claim">Claim a Gift Box</a>
  </div>
);

export default App;
