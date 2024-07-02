// SPDX-License-Identifier: MIT
//Lưu trữ nội dung như text hoặc URLs/IPFS hashes
pragma solidity ^0.8.0;

contract GiftBox {
    struct Box {
        address sender;
        address receiver;
        string message; // Lưu trữ nội dung như text hoặc URLs/IPFS hashes
        uint256 asset;
        bool claimed;
    }

    mapping(uint256 => Box) public boxes;
    mapping(address => uint256) public balances;
    uint256 public totalBoxes;

    event BoxCreated(uint256 indexed boxId, address indexed sender, address indexed receiver, string message, uint256 asset);
    event BoxClaimed(uint256 indexed boxId, address indexed receiver);

    function createBox(address _receiver, string memory _message, uint256 _asset) public {
        require(_receiver != address(0), "Invalid receiver address");
        require(_asset >= 0, "Asset must be greater than 0");
        require(msg.sender.balance >= _asset, "Insufficient balance");

        // Trừ số asset từ số dư của người gửi
        balances[msg.sender] -= _asset;

        totalBoxes++;
        boxes[totalBoxes] = Box(msg.sender, _receiver, _message, _asset, false);
        emit BoxCreated(totalBoxes, msg.sender, _receiver, _message, _asset);
    }

    function claimBox(uint256 _boxId) public {
        require(_boxId > 0 && _boxId <= totalBoxes, "Invalid box ID");
        require(boxes[_boxId].receiver == msg.sender, "You are not the receiver of this box");
        require(!boxes[_boxId].claimed, "This box has already been claimed");

        // Perform asset transfer here (logic should be implemented)
        // Assuming transferAsset function is implemented

        // Transfer asset to receiver
        balances[boxes[_boxId].receiver] += boxes[_boxId].asset;
        // Mark box as claimed
        boxes[_boxId].claimed = true;
        emit BoxClaimed(_boxId, msg.sender);
    }

    function deposit(uint256 _amount) public {
    balances[msg.sender] += _amount;
}
}
