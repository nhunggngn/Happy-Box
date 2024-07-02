// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GiftBox {
    struct Box {
        address sender;
        address receiver;
        string message; 
        string assetUrl; // Thay đổi từ uint256 thành string để lưu trữ URL của tài sản
        bool claimed;
    }

    mapping(uint256 => Box) public boxes;
    mapping(address => uint256) public balances;
    uint256 public totalBoxes;

    event BoxCreated(uint256 indexed boxId, address indexed sender, address indexed receiver, string message, string assetUrl);
    event BoxClaimed(uint256 indexed boxId, address indexed receiver);

    function createBox(address _receiver, string memory _message, string memory _assetUrl) public payable {
        require(_receiver != address(0), "Invalid receiver address");
        require(bytes(_assetUrl).length > 0, "Asset URL must not be empty");

        totalBoxes++;
        boxes[totalBoxes] = Box(msg.sender, _receiver, _message, _assetUrl, false);
        emit BoxCreated(totalBoxes, msg.sender, _receiver, _message, _assetUrl);
    }

    function claimBox(uint256 _boxId) public {
        require(_boxId > 0 && _boxId <= totalBoxes, "Invalid box ID");
        require(boxes[_boxId].receiver == msg.sender, "You are not the receiver of this box");
        require(!boxes[_boxId].claimed, "This box has already been claimed");

        boxes[_boxId].claimed = true;
        emit BoxClaimed(_boxId, msg.sender);
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }
}
