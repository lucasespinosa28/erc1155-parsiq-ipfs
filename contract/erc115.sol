//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract TriggerMint is ERC1155, Ownable  {
    
    event Minted (address indexed _owner, uint256 indexed _id);
    uint256 private _tokenIds = 0;
    
    constructor() ERC1155("https://storageapi.fleek.co/lucasespinosa28-team-bucket/trigger/metadata/{id}.json") {
    }
    
    function MintNFT() public {
       _mint(msg.sender, _tokenIds, 1, "");
       _tokenIds = _tokenIds + 1;
       emit Minted(msg.sender, _tokenIds);
    }
    
}