// SPDX-License-Identifier: MIT
pragma solidity >=0.5.1 <0.9.0;

contract MessageSender {

    address owner;
    string[] messages;

    constructor() public {
        owner = msg.sender;
    }

    function makePayment() payable public {}

    function getBalance() public view returns (uint256){
        return address(this).balance;
    }

    function addMessage(address payable payableAddress, string memory message) public returns (bool) {
        messages.push(message);

        if(messages.length % 4 == 0){
            payableAddress.transfer(100000000000000000);
            return true;
        }
        return false;
    }

    function getMessage(uint id) view public returns (string memory) {
        return messages[id];
    }

    function getTotalMessages() view public returns(uint){
        return messages.length;
    }
}