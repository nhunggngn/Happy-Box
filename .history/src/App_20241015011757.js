import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateBox from './CreateBox';
import ClaimBox from './ClaimBox';
import web3 from './web3';
import './HomePage.css';

const App = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [accountName, setAccountName] = useState('');

  const accountNames = {
    '0x5a601bB54823c2B4E9F4f2C65E5A73894E770e0A': 'Tài khoản 4',
    '0xed8e7bC2F0f6F5EaC59B5DAfe4620c9531b6c67D': 'Account 1',
    '0xe93eD485B948A0D92722C082a875AA79375C0DF5': 'Account 2',
    '0xDDccC9Fe017D978EC6258BA610cB3BA1C698e274': 'Account 3'
  };

  useEffect(() => {
    const loadAccountData = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        console.log("No accounts found. Please connect your wallet.");
        return;
      }
      const account = accounts[0];
      setAccount(account);
      const balanceWei = await web3.eth.getBalance(account);
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
      setBalance(balanceEth);

      const name = accountNames[account] || 'Unknown Account';
      setAccountName(name);
    };

    loadAccountData();
  }, []);

  return (
    <Router>
      <div>
        <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item">Happy Box</Link>
            <Link to="/create" className="navbar-item">Create Box</Link>
            <Link to="/claim" className="navbar-item">Claim Box</Link>
          </div>
          <div className="navbar-end">
            {account && (
              <div className="navbar-item">
                <div className="wallet-info">
                  <p>Account: {accountName}</p>
                  <p>Balance: {balance} ETH</p>
                </div>
              </div>
            )}
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
  <div className="homepage-container">
    <div className="hero-section">
      <img 
        src="https://imgur.com/gallery/toss-coin-to-fellow-imigurian-holRh2y#/t/blockchain" 
        alt="Gift Box" 
        className="hero-image"
      />
      <div className="hero-text">
        <h1 className="title">Welcome to Gift Box DApp!</h1>
        <p className="subtitle">Easily create and claim gift boxes on the blockchain!</p>
        <div className="buttons">
          <Link to="/create" className="button is-primary" id='button-home'>Create a Gift Box</Link>
          <Link to="/claim" className="button is-secondary" id='button-home'>Claim a Gift Box</Link>
        </div>
      </div>
    </div>
  </div>
);

export default App;
