import React, { useState, useEffect } from 'react';
import giftBox from './giftBox';
import web3 from './web3';
import './GiftBox.css';

const ClaimBox = () => {
  const [boxId, setBoxId] = useState('');
  const [assetUrl, setAssetUrl] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [boxCount, setBoxCount] = useState(0);

  useEffect(() => {
    const fetchBoxCount = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        const totalBoxes = await giftBox.methods.getBoxCount().call();
        let count = 0;

        for (let i = 1; i <= totalBoxes; i++) {
          const box = await giftBox.methods.boxes(i).call();
          if (box.receiver.toLowerCase() === accounts[0].toLowerCase() && !box.claimed) {
            count++;
          }
        }
        setBoxCount(count);
      } catch (error) {
        console.error('Error fetching box count:', error);
      }
    };

    fetchBoxCount();
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
      setBoxCount(boxCount - 1);
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

  return (
    <div>
      <h2 className="title">Claim Your Gift Box</h2>
      <div className="box-count">
        <p>You have {boxCount} unclaimed gift box{boxCount !== 1 ? 'es' : ''}.</p>
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
      {assetUrl && (
        <div className="box-container">
          <div className="box-item">
            <h3 className="box-header">Your Gift:</h3>
            <img className="gift-image" src={assetUrl} alt="Gift Asset" />
            <p className="box-content"><strong>Message:</strong> {message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimBox;
