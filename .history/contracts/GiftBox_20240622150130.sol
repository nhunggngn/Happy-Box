// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GiftBox {
    struct Box {
        address sender;
        address receiver;
        string message;
        string asset; // Changed to string to store IPFS hash
        bool claimed;
    }

    mapping(uint256 => Box) public boxes;
    uint256 public totalBoxes;

    event BoxCreated(uint256 indexed boxId, address indexed sender, address indexed receiver, string message, string asset);
    event BoxClaimed(uint256 indexed boxId, address indexed receiver);

    function createBox(address _receiver, string memory _message, string memory _asset) public {
        require(_receiver != address(0), "Invalid receiver address");

        totalBoxes++;
        boxes[totalBoxes] = Box(msg.sender, _receiver, _message, _asset, false);
        emit BoxCreated(totalBoxes, msg.sender, _receiver, _message, _asset);
    }

    function claimBox(uint256 _boxId) public {
        require(_boxId > 0 && _boxId <= totalBoxes, "Invalid box ID");
        require(boxes[_boxId].receiver == msg.sender, "You are not the receiver of this box");
        require(!boxes[_boxId].claimed, "This box has already been claimed");

        // Mark box as claimed
        boxes[_boxId].claimed = true;
        emit BoxClaimed(_boxId, msg.sender);
    }
}
