import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import './App.css';
import ClaimBox from './ClaimBox';
import CreateBox from './CreateBox';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">Happy Box</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="#create">Create Box</Nav.Link>
              <Nav.Link href="#claim">Claim Box</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </header>
      <Container>
        <div id="create">
          <CreateBox />
        </div>
        <div id="claim">
          <ClaimBox />
        </div>
      </Container>
    </div>
  );
}

export default App;
