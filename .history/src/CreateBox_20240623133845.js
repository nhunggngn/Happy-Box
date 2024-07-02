import React, { useState, useEffect } from 'react';
import giftBox from './giftBox';
import web3 from './web3';
import axios from 'axios';
import './styles.css'; // Import the CSS file

const CreateBox = () => {
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [totalBoxes, setTotalBoxes] = useState(0);
  const [boxes, setBoxes] = useState([]);
  const [currentAccount, setCurrentAccount] = useState('');

  useEffect(() => {
    const loadBoxData = async () => {
      const accounts = await web3.eth.getAccounts();
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
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
    } catch (error) {
      console
