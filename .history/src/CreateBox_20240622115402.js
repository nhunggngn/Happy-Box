import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import giftBox from './giftBox';
import web3 from './web3';
import axios from 'axios';

const CreateBox = () => {
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');

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
      <h2>Create a Gift Box</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Receiver Address</Form.Label>
          <Form.Control
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Enter receiver address"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Message</Form.Label>
          <Form.Control
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Upload File</Form.Label>
          <Form.Control
            type="file"
            onChange={captureFile}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Box
        </Button>
      </Form>
      {ipfsHash && (
        <div>
          <h3>IPFS Hash:</h3>
          <p>{ipfsHash}</p>
        </div>
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
