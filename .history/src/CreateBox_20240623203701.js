import React, { useState, useEffect } from 'react';
import giftBox from './giftBox';
import web3 from './web3';
import axios from 'axios';
import QRCode from 'qrcode.reac;
import './GiftBox.css'; // Import the CSS file

const CreateBox = () => {
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [totalBoxes, setTotalBoxes] = useState(0);
  const [boxes, setBoxes] = useState([]);
  const [currentAccount, setCurrentAccount] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [boxLink, setBoxLink] = useState('');

  useEffect(() => {
    const loadBoxData = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        alert("Please connect your wallet.");
        return;
      }
      const currentAccount = accounts[0];
      setCurrentAccount(currentAccount);

      const totalBoxes = await giftBox.methods.totalBoxes().call();
      setTotalBoxes(totalBoxes);

      const boxPromises = [];
      for (let i = 1; i <= totalBoxes; i++) {
        boxPromises.push(giftBox.methods.boxes(i).call());
      }
      const allBoxes = await Promise.all(boxPromises);

      // Filter boxes created by the current account
      const filteredBoxes = allBoxes.filter(box => box.sender.toLowerCase() === currentAccount.toLowerCase());
      setBoxes(filteredBoxes);
    };

    loadBoxData();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setCurrentAccount(accounts[0]);
        const totalBoxes = await giftBox.methods.totalBoxes().call();
        setTotalBoxes(totalBoxes);
      } catch (error) {
        console.error("Error connecting wallet: ", error);
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        alert("Please connect your wallet.");
        return;
      }
      const currentAccount = accounts[0];
      setCurrentAccount(currentAccount);

      // Gửi file lên IPFS
      const ipfsResult = await uploadToIPFS(file, fileName);
      const ipfsHash = ipfsResult.data.IpfsHash;
      setIpfsHash(ipfsHash);

      // Tạo gift box
      await giftBox.methods.createBox(receiver, message, `ipfs://${ipfsHash}`).send({ from: currentAccount });

      // Cập nhật lại danh sách hộp quà và tổng số hộp quà
      const totalBoxes = await giftBox.methods.totalBoxes().call();
      setTotalBoxes(totalBoxes);

      const boxPromises = [];
      for (let i = 1; i <= totalBoxes; i++) {
        boxPromises.push(giftBox.methods.boxes(i).call());
      }
      const allBoxes = await Promise.all(boxPromises);

      // Filter boxes created by the current account
      const filteredBoxes = allBoxes.filter(box => box.sender.toLowerCase() === currentAccount.toLowerCase());
      setBoxes(filteredBoxes);

      const newBoxId = totalBoxes;
      const link = `${window.location.origin}/claim/${newBoxId}`;
      setBoxLink(link);

      const qrCodeData = await QRCode.toDataURL(link);
      setQrCode(qrCodeData);

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
      {!currentAccount ? (
        <button className="button is-primary" onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <React.Fragment>
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
          {qrCode && (
            <div>
              <h3 className="title is-4">Share this QR Code or Link with the receiver:</h3>
              <img src={qrCode} alt="QR Code" />
              <p><a href={boxLink}>{boxLink}</a></p>
            </div>
          )}
        </React.Fragment>
      )}
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
