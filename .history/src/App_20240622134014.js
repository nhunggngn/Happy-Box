import React, { Component } from 'react';
import { Table, Grid, Button, Form } from 'react-bootstrap';
import './App.css';
import web3 from './web3';
import storehash from './storehash';
import axios from 'axios'; // Sử dụng axios để gửi yêu cầu HTTP
import dotenv from 'dotenv';
dotenv.config();

class App extends Component {
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>IPFS</h1>
        </header>
  
        <hr />
        <Grid>
          <h3> Choose file to send to IPFS </h3>
            
        
        
            <Button
              
              bsStyle="primary"
              type="submit">
              Send it
            </Button>
          </Form>
          <hr />
          <Button onClick={this.onClick}> Get Transaction Receipt </Button>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>Tx Receipt Category</th>
                <th>Values</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>IPFS Hash # stored on Eth Contract</td>
                <td>{this.state.ipfsHash}</td>
              </tr>
              <tr>
                <td>Ethereum Contract Address</td>
                <td>{this.state.ethAddress}</td>
              </tr>
              <tr>
                <td>Tx Hash # </td>
                <td>{this.state.transactionHash}</td>
              </tr>
              <tr>
                <td>Block Number # </td>
                <td>{this.state.blockNumber}</td>
              </tr>
              <tr>
                <td>Gas Used</td>
                <td>{this.state.gasUsed}</td>
              </tr>
            </tbody>
          </Table>
        </Grid>
      </div>
    );
  }  
}

export default App;
