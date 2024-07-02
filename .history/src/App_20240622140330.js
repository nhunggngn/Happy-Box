import React, { Component } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Web3 from 'web3';
import axios from 'axios';
import CreateBox from './CreateBox';
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

  captureFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  };

  convertToBuffer = async (reader) => {
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer });
  };

  onClick = async () => {
    try {
      this.setState({ blockNumber: "waiting.." });
      this.setState({ gasUsed: "waiting..." });
      await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt) => {
        console.log(err, txReceipt);
        this.setState({ txReceipt });
      });
      this.setState({ blockNumber: this.state.txReceipt.blockNumber });
      this.setState({ gasUsed: this.state.txReceipt.gasUsed });
    } catch (error) {
      console.log(error);
    }
  };

  onSubmit = async (event) => {
    event.preventDefault();

    try {
      const accounts = await web3.eth.getAccounts();
      console.log('Sending from Metamask account: ' + accounts[0]);

      const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
      const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;

      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      const data = new FormData();
      data.append('file', new Blob([this.state.buffer]), this.state.fileName || 'file-upload');

      const metadata = JSON.stringify({
        name: this.state.fileName || 'file-upload'
      });
      data.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0
      });
      data.append('pinataOptions', options);

      const result = await axios.post(url, data, {
        maxContentLength: 'Infinity', 
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataSecretApiKey
        }
      });

      const ipfsHash = result.data.IpfsHash;
      console.log('IPFS Hash: ', ipfsHash);

      this.setState({ ipfsHash });

      // Create box on the blockchain
      await giftBox.methods.createBox(this.state.receiver, this.state.message, ipfsHash).send({
        from: accounts[0]
      }, (error, transactionHash) => {
        console.log(transactionHash);
        this.setState({ transactionHash });
      });
    } catch (error) {
      console.error('Error uploading file to Pinata: ', error);
    }
  };

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
