import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import CreateBox from './ClaimBox';
import ClaimBox from './ClaimBox';

class App extends Component {
  state = {
    ipfsHash: null,
    buffer: '',
    ethAddress: '',
    blockNumber: '',
    transactionHash: '',
    fileName: '',
    message: '',
    receiver: ''
  };

  // Các phương thức khác của component App ở đây

  render() {
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
              <Route exact path="/">
                <Redirect to="/create" />
              </Route>
              <Route path="/create" component={CreateBox} />
              <Route path="/claim" component={ClaimBox} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }  
}

export default App;
