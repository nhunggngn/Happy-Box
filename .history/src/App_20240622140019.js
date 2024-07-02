import React, { Component } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import CreateBox from './CreateBox';
import ClaimBox from './ClaimBox';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Navbar bg="dark" variant="dark">
              <Container>
                <Navbar.Brand href="/">Happy Box</Navbar.Brand>
                <Nav className="me-auto">
                  <Nav.Link href="/create">Create Box</Nav.Link>
                  <Nav.Link href="/claim">Claim Box</Nav.Link>
                </Nav>
              </Container>
            </Navbar>
          </header>

          <Container className="mt-3">
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/create" />} />
              <Route path="/create" component={CreateBox} />
              <Route path="/claim" component={ClaimBox} />
            </Switch>
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
