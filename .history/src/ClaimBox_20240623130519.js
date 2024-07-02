import React, { useState } from 'react';
import giftBox from './giftBox';

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

      const assetHash = box.assetUrl.replace('ipfs://', '');
      const assetUrl = `https://gateway.pinata.cloud/ipfs/${assetHash}`;
      setAssetUrl(assetUrl);
      setMessage(box.message);
      setErrorMessage('');
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
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {assetUrl && (
        <div className="box">
          <h3 className="title is-4">Your Gift:</h3>
          <img src={assetUrl} alt="Gift Asset" />

        </div>
      )}
    </div>
  );
};

export default ClaimBox;
