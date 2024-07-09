// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GiftBox {
    struct Box {
        address sender;
        address receiver;
        string message; 
        string assetUrl; 
        uint256 amount; 
        bool claimed;
    }

    mapping(uint256 => Box) public boxes;
    uint256 public totalBoxes;

    event BoxCreated(uint256 indexed boxId, address indexed sender, address indexed receiver, string message, string assetUrl, uint256 amount);
    event BoxClaimed(uint256 indexed boxId, address indexed receiver, uint256 amount);

    function createBox(address _receiver, string memory _message, string memory _assetUrl) public payable {
        require(_receiver != address(0), "Invalid receiver address");
        require(bytes(_assetUrl).length > 0, "Asset URL must not be empty");
        require(msg.value > 0 && msg.value <= address(msg.sender).balance, "Insufficient balance to send");

        totalBoxes++;
        uint256 amount = msg.value; 
        boxes[totalBoxes] = Box(msg.sender, _receiver, _message, _assetUrl, amount, false);
        emit BoxCreated(totalBoxes, msg.sender, _receiver, _message, _assetUrl, amount);
    }

    function claimBox(uint256 _boxId) public {
        require(_boxId > 0 && _boxId <= totalBoxes, "Invalid box ID");
        require(boxes[_boxId].receiver == msg.sender, "You are not the receiver of this box");
        require(!boxes[_boxId].claimed, "This box has already been claimed");

        uint256 amount = boxes[_boxId].amount;
        boxes[_boxId].claimed = true;
        emit BoxClaimed(_boxId, msg.sender, amount);

        if (amount > 0) {
            payable(msg.sender).transfer(amount);
        }
    }
}
