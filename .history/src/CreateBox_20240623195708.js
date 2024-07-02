import React, { useState, useEffect } from 'react';
import giftBox from './giftBox';
import web3 from './web3';
import axios from 'axios';
import './GiftBox.css';

const CreateBox = () => {
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [totalBoxCount, setTotalBoxCount] = useState(0);
  const [claimedBoxCount, setClaimedBoxCount] = useState(0);
  const [unclaimedBoxCount, setUnclaimedBoxCount] = useState(0);
  const [currentAccount, setCurrentAccount] = useState('');

  const fetchBoxCounts = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const totalBoxes = await giftBox.methods.getBoxCount().call();
      let totalCount = 0;
      let claimedCount = 0;
      let unclaimedCount = 0;

      for (let i = 1; i <= totalBoxes; i++) {
        const box = await giftBox.methods.boxes(i).call();
        if (box.sender.toLowerCase() === accounts[0].toLowerCase()) {
          totalCount++;
          if (box.claimed) {
            claimedCount++;
          } else {
            unclaimedCount++;
          }
        }
      }
      setTotalBoxCount(totalCount);
      setClaimedBoxCount(claimedCount);
      setUnclaimedBoxCount(unclaimedCount);
    } catch (error) {
      console.error('Error fetching box counts:', error);
    }
  };

  useEffect(() => {
    const loadBoxData = async () => {
      const accounts = await web3.eth.getAccounts();
      setCurrentAccount(accounts[0]);
      await fetchBoxCounts();
    };

    loadBoxData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];

      // Upload file to IPFS
      const ipfsResult = await uploadToIPFS(file, fileName);
      const ipfsHash = ipfsResult.data.IpfsHash;
      setIpfsHash(ipfsHash);

      // Create gift box
      await giftBox.methods.createBox(receiver, message, `ipfs://${ipfsHash}`).send({ from: currentAccount });

      // Update box counts
      await fetchBoxCounts();
    } catch (error) {
      console.error("Error creating box: ", error);
    }
  };

  const captureFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    setFile(file);
    setFileName(file.name);
  };

  return (
    <div>
      <h2 className="title">Create a Gift Box</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Receiver Address</label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="Enter receiver address"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Message</label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Upload File</label>
          <div className="control">
            <input
              className="input"
              type="file"
              onChange={captureFile}
            />
          </div>
        </div>
        <div className="control">
          <button className="button is-primary" type="submit">Create Box</button>
        </div>
      </form>
      {ipfsHash && (
        <div>
          <h3 className="title is-4">IPFS Hash:</h3>
          <p>{ipfsHash}</p>
        </div>
      )}
      <div>
        <h3 className="title is-4">Box Counts</h3>
        <p>Total Boxes Created by You: {totalBoxCount}</p>
        <p>Unclaimed Boxes: {unclaimedBoxCount}</p>
        <p>Claimed Boxes: {claimedBoxCount}</p>
      </div>
    </div>
  );
};

const uploadToIPFS = async (file, fileName) => {
  const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
  const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;

  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();
  data.append('file', new Blob([file]), fileName);

  const metadata = JSON.stringify({
    name: fileName
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

  return result;
};

export default CreateBox;
