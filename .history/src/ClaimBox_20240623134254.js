import React, { useState } from 'react';
import giftBox from './giftBox';
import './styles.css'; // Import the CSS file

const ClaimBox = () => {
  const [boxId, setBoxId] = useState('');
  const [assetUrl, setAssetUrl] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const claimBox = async (boxId) => {
    try {
      const box = await giftBox.methods.boxes(boxId).call();
      
      if (!box.assetUrl) {
        setErrorMessage('Box asset is undefined');
        return;
      }

      if (box.receiver.toLowerCase() !== (await web3.eth.getAccounts())[0].toLowerCase()) {
        setErrorMessage('You are not the receiver of this box');
        return;
      }

      const assetHash = box.assetUrl.replace('ipfs://', '');
      const assetUrl = `https://gateway.pinata.cloud/ipfs/${assetHash}`;
      setAssetUrl(assetUrl);
      setMessage(box.message);
      setErrorMessage('');
      
      await giftBox.methods.claimBox(boxId).send({ from: (await web3.eth.getAccounts())[0] });
    } catch (error) {
      console.error('Error claiming box:', error);
      setErrorMessage('Error claiming box');
    }
  };

  const handleClaim = () => {
    setErrorMessage('');
    claimBox(boxId);
  };

  return (
    <div>
      <h2 className="title">Claim Your Gift Box</h2>
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
