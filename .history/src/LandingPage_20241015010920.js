import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; 

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to Happy Box DApp</h1>
        <p>Discover the best way to send and receive gift boxes on the blockchain!</p>
        <div className="landing-buttons">
          <Link to="/create" className="button is-primary">Create a Gift Box</Link>
          <Link to="/claim" className="button is-secondary">Claim a Gift Box</Link>
        </div>
      </header>
      <section className="features">
        <h2>Why Choose Happy Box?</h2>
        <ul>
          <li>Fast and Secure Transactions</li>
          <li>Decentralized on the Blockchain</li>
          <li>Unique Gift Messages and Digital Assets</li>
        </ul>
      </section>
      <footer className="landing-footer">
        <p>© 2024 Happy Box DApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
