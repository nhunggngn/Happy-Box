import React, { useState } from 'react';
import giftBox from './giftBox';

const ClaimBox = () => {
  const [boxId, setBoxId] = useState('');
  const [assetUrl, setAssetUrl] = useState('');

  const claimBox = async (boxId) => {
    try {
      const box = await giftBox.methods.boxes(boxId).call();
      if (box.assetUrl) {
        const assetHash = box.assetUrl.replace('ipfs://', '');
        const assetUrl = `https://gateway.pinata.cloud/ipfs/${assetHash}`;
        setAssetUrl(assetUrl);
      } else {
        console.error('Box does not have an asset URL.');
      }
    } catch (error) {
      console.error('Error claiming box:', error);
    }
  };

  const handleClaim = () => {
    claimBox(boxId);
  };

  return (
    <div>
      <h2>Claim Your Gift Box</h2>
      <input
        type="text"
        value={boxId}
        onChange={(e) => setBoxId(e.target.value)}
        placeholder="Enter Box ID"
      />
      <button onClick={handleClaim}>Claim Box</button>
      {assetUrl && (
        <div>
          <h3>Your Gift:</h3>
          <img src={assetUrl} alt="Gift Asset" />
        </div>
      )}
    </div>
  );
};

export default ClaimBox;
