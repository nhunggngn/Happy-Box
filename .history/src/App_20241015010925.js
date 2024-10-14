import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateBox from './CreateBox';
import ClaimBox from './ClaimBox';
import web3 from './web3';
import './HomePage.css';
import './LandingPage';

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
              <Route exact path="/" element={<LandingPage />} />  {/* Landing Page làm trang mặc định */}
              <Route path="/create" element={<CreateBox />} />
              <Route path="/claim" element={<ClaimBox />} />
              <Route path="/home" element={<HomePage />} /> {/* HomePage sau LandingPage */}
            </Routes>
          </div>
        </section>
      </div>
    </Router>
  );
};

// Component LandingPage: Trang mặc định khi vào trang web
const LandingPage = () => (
  <div className="landing-page">
    <h1 className="landing-title">Welcome to Happy Box DApp!</h1>
    <p className="landing-subtitle">Easily send and receive gift boxes on the blockchain.</p>
    <div className="landing-buttons">
      <Link to="/create" className="button is-primary">Create a Gift Box</Link>
      <Link to="/claim" className="button is-secondary">Claim a Gift Box</Link>
    </div>
  </div>
);

// Trang HomePage: Được điều hướng sau Landing Page
const HomePage = () => (
  <div>
    <h1 className="title">Welcome to Gift Box DApp!</h1>
    <Link to="/create" className="button is-primary" id='button-home'>Create a Gift Box</Link>
    <Link to="/claim" className="button is-primary" id='button-home'>Claim a Gift Box</Link>
  </div>
);

export default App;
