import React, { useState } from 'react';
import giftBox from './giftBox';

const ClaimBox = () => {
  const [boxId, setBoxId] = useState('');
  const [assetUrl, setAssetUrl] = useState('');

  const claimBox = async (boxId) => {
    try {
      const box = await giftBox.methods.boxes(boxId).call();
      const assetHash = box.asset.replace('ipfs://', '');
      const assetUrl = `https://ipfs.infura.io/ipfs/${assetHash}`;
      setAssetUrl(assetUrl);
    } catch (error) {
      console.error('Error claiming box:', error);
    }
  };

  const handleClaim = () => {
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
