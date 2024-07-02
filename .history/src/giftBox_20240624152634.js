pragma solidity ^0.8.0;

contract GiftBox {
    struct Box {
        address sender;
        address receiver;
        string message;
        string assetUrl;
        bool claimed;
        uint256 amount; // Thêm trường này để lưu trữ số ETH
    }

    mapping(uint256 => Box) public boxes;
    uint256 public totalBoxes;

    function createBox(address _receiver, string memory _message, string memory _assetUrl) public payable {
        totalBoxes++;
        boxes[totalBoxes] = Box(msg.sender, _receiver, _message, _assetUrl, false, msg.value);
    }

    function claimBox(uint256 _boxId) public {
        Box storage box = boxes[_boxId];
        require(box.receiver == msg.sender, "You are not the receiver of this box");
        require(!box.claimed, "This box has already been claimed");

        box.claimed = true;
        payable(box.receiver).transfer(box.amount); // Chuyển số ETH kèm theo hộp quà cho người nhận
    }

    function getBox(uint256 _boxId) public view returns (address, address, string memory, string memory, bool, uint256) {
        Box storage box = boxes[_boxId];
        return (box.sender, box.receiver, box.message, box.assetUrl, box.claimed, box.amount);
    }
}
