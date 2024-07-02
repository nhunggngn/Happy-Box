import React, { useState, useEffect } from 'react';
import giftBox from '../contracts/';
import web3 from '../web3';
import axios from 'axios';

const CreateBox = () => {
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [totalBoxes, setTotalBoxes] = useState(0);
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    const loadBoxData = async () => {
      const totalBoxes = await giftBox.methods.totalBoxes().call();
      setTotalBoxes(totalBoxes);

      const boxPromises = [];
      for (let i = 1; i <= totalBoxes; i++) {
        boxPromises.push(giftBox.methods.boxes(i).call());
      }
      const boxes = await Promise.all(boxPromises);
      setBoxes(boxes);
    };

    loadBoxData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();

      // Gửi file lên IPFS
      const ipfsResult = await uploadToIPFS(file, fileName);
      const ipfsHash = ipfsResult.data.IpfsHash;
      setIpfsHash(ipfsHash);

      // Tạo gift box
      await giftBox.methods.createBox(receiver, message, `ipfs://${ipfsHash}`).send({ from: accounts[0] });

      // Cập nhật lại danh sách hộp quà và tổng số hộp quà
      const totalBoxes = await giftBox.methods.totalBoxes().call();
      setTotalBoxes(totalBoxes);

      const boxPromises = [];
      for (let i = 1; i <= totalBoxes; i++) {
        boxPromises.push(giftBox.methods.boxes(i).call());
      }
      const boxes = await Promise.all(boxPromises);
      setBoxes(boxes);
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
        <h3 className="title is-4">Total Boxes: {totalBoxes}</h3>
        <ul>
          {boxes.map((box, index) => (
            <li key={index}>
              <p><strong>Box ID:</strong> {index + 1}</p>
              <p><strong>Sender:</strong> {box.sender}</p>
              <p><strong>Receiver:</strong> {box.receiver}</p>
              <p><strong>Message:</strong> {box.message}</p>
              <p><strong>Asset:</strong> {box.asset}</p>
              <p><strong>Claimed:</strong> {box.claimed ? 'Yes' : 'No'}</p>
              <hr />
            </li>
          ))}
        </ul>
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
