import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './App.css';
import ClaimBox from './ClaimBox';
import CreateBox from './CreateBox';

functi App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">Happy Box</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#create">Create Box</Nav.Link>
            <Nav.Link href="#claim">Claim Box</Nav.Link>
          </Nav>
        </Navbar>
      </header>
      <div className="content">
        <div id="create">
          <CreateBox />
        </div>
        <div id="claim">
          <ClaimBox />
        </div>
      </div>
    </div>
  );
}

export default App;
