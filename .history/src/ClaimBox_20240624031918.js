import React, { useState, useEffect } from 'react';
import giftBox from '../contracts/giftBox';
import web3 from '../utils/web3';
import Modal from 'react-modal';
import '../styles/GiftBox.css';

Modal.setAppElement('#root');

const ClaimBox = () => {
  const [boxId, setBoxId] = useState('');
  const [assetUrl, setAssetUrl] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [totalBoxCount, setTotalBoxCount] = useState(0);
  const [claimedBoxCount, setClaimedBoxCount] = useState(0);
  const [unclaimedBoxCount, setUnclaimedBoxCount] = useState(0);
  const [claimedBoxes, setClaimedBoxes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');

  useEffect(() => {
    const fetchAccountAndBoxes = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          alert("Please connect your wallet.");
          return;
        }
        const account = accounts[0];
        setCurrentAccount(account);

        const totalBoxes = await giftBox.methods.totalBoxes().call();
        let totalCount = 0;
        let claimedCount = 0;
        let unclaimedCount = 0;
        const claimedBoxes = [];

        for (let i = 1; i <= totalBoxes; i++) {
          const box = await giftBox.methods.boxes(i).call();
          if (box.receiver.toLowerCase() === account.toLowerCase()) {
            totalCount++;
            if (box.claimed) {
              claimedCount++;
              const assetUrl = `https://gateway.pinata.cloud/ipfs/${box.assetUrl.replace('ipfs://', '')}`;
              claimedBoxes.push({
                id: i,
                message: box.message,
                assetUrl
              });
            } else {
              unclaimedCount++;
            }
          }
        }
        setTotalBoxCount(totalCount);
        setClaimedBoxCount(claimedCount);
        setUnclaimedBoxCount(unclaimedCount);
        setClaimedBoxes(claimedBoxes);
      } catch (error) {
        console.error('Error fetching box counts:', error);
      }
    };

    fetchAccountAndBoxes();
  }, []);

  const claimBox = async (boxId) => {
    try {
      const accounts = await web3.eth.getAccounts();
      const box = await giftBox.methods.boxes(boxId).call();

      // Check if the caller is the receiver
      if (box.receiver.toLowerCase() !== accounts[0].toLowerCase()) {
        setErrorMessage('You are not the receiver of this box');
        return;
      }

      // Check if the box has already been claimed
      if (box.claimed) {
        setErrorMessage('This box has already been claimed');
        return;
      }

      // Claim the box
      await giftBox.methods.claimBox(boxId).send({ from: accounts[0] });

      // Get the asset URL
      const assetHash = box.assetUrl.replace('ipfs://', '');
      const assetUrl = `https://gateway.pinata.cloud/ipfs/${assetHash}`;
      setAssetUrl(assetUrl);
      setMessage(box.message);
      setErrorMessage('');
      setSuccessMessage('Box claimed successfully!');
      setClaimedBoxCount(claimedBoxCount + 1);
      setUnclaimedBoxCount(unclaimedBoxCount - 1);

      // Update the claimed boxes
      const newClaimedBox = {
        id: boxId,
        message: box.message,
        assetUrl
      };
      const updatedClaimedBoxes = [...claimedBoxes, newClaimedBox];
      setClaimedBoxes(updatedClaimedBoxes);

      // Open modal to show the claimed box
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error claiming box:', error);
      setErrorMessage('Error claiming box');
      setSuccessMessage('');
    }
  };

  const handleClaim = () => {
    setErrorMessage('');
    setSuccessMessage('');
    claimBox(boxId);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <h2 className="title">Claim Your Gift Box</h2>
      <div className="box-count">
        <p>Total Gift Boxes: {totalBoxCount}</p>
        <p>Unclaimed Gift Boxes: {unclaimedBoxCount}</p>
        <p>Claimed Gift Boxes: {claimedBoxCount}</p>
      </div>
      <div className="field">
        <label className="label">Box ID</label>
        <div className="control">
          <input
            className="input"
            type="text"
            value={boxId}
            onChange={(e) => setBoxId(e.target.value)}
            placeholder="Enter Box ID"
          />
        </div>
      </div>
      <div className="control">
        <button className="button is-primary" onClick={handleClaim}>Claim Box</button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <h3 className="title is-4">My Gift Boxes:</h3>
      <div className="box-container">
        {claimedBoxes.map((box) => (
          <div className="box-item" key={box.id}>
            <h3 className="box-header">Your Gift:</h3>
            <div className="box-header">Box ID: {box.id}</div>
            <img className="gift-image" src={box.assetUrl} alt="Gift Asset" />
            <p className="box-content"><strong>Message:</strong> {box.message}</p>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Claimed Box"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2 className="title">Your Claimed Gift Box</h2>
        <button className="close-button" onClick={closeModal}>Close</button>
        <div className="box-item">
          <h3 className="box-header">Box ID: {boxId}</h3>
          <img className="gift-image" src={assetUrl} alt="Gift Asset" />
          <p className="box-content"><strong>Message:</strong> {message}</p>
        </div>
      </Modal>
    </div>
  );
};

export default ClaimBox;
