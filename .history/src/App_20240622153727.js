import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import './App.css';
import CreateBox from './components/CreateBox';
import ClaimBox from './components/ClaimBox';

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">Happy Box</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/create">Create Box</Nav.Link>
              <Nav.Link href="/claim">Claim Box</Nav.Link>
            </Nav>
          </Navbar>
        </header>

        <div className="container mt-3">
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/create" />} />
            <Route path="/create" component={CreateBox} />
            <Route path="/claim" component={ClaimBox} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
