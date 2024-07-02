import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import './App.css';
import CreateBox from './component/CreateBox';
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
          <Routes>
            <Route path="/" element={<Navigate to="/create" />} />
            <Route path="/create" element={<CreateBox />} />
            <Route path="/claim" element={<ClaimBox />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
