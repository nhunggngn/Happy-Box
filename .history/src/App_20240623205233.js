import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateBox from './CreateBox';
import ClaimBox from './ClaimBox';
import ./ho

const App = () => {
  return (
    <Router>
      <div>
        <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item">Happy Box</Link>
            <Link to="/create" className="navbar-item">Create Box</Link>
            <Link to="/claim" className="navbar-item">Claim Box</Link>
          </div>
        </nav>
        <section className="section">
          <div className="container">
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateBox />} />
              <Route path="/claim" element={<ClaimBox />} />
            </Routes>
          </div>
        </section>
      </div>
    </Router>
  );
};

const HomePage = () => (
  <div>
    <h1>Welcome to Gift Box DApp!</h1>
    <a href="/create">Create a Gift Box</a>
    <br />
    <a href="/claim">Claim a Gift Box</a>
  </div>
);

export default App;
