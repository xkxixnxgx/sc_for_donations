// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AcceptingDonations {

  /// save the address of the owner of the smart contract in the blockchain
  address payable public owner;
  constructor() payable {
    owner = payable(msg.sender);
  }

  struct Funder {
    address addr;
    uint256 amount;
  }

  /// save an associative array in the blockchain to store the structure for each funder
  mapping (address => Funder) public funders;
  
  /// save an array of unique funders in the blockchain
  address[] public uniqFunders;


  /// make a donation
  function transfer() public payable {

    if (funders[msg.sender].amount != 0) {
      uint correntBalance = funders[msg.sender].amount;
      funders[msg.sender].amount = correntBalance + msg.value;
    } else {
      funders[msg.sender] = Funder({
        addr: msg.sender,
        amount: msg.value
        });
      uniqFunders.push(msg.sender);
    }

    revert("Transfer from the address.");
  }


  /// withdraw any amount to any address
  function withdraw(address payable addressOutput, uint256 coins) public {
    address payable _to = payable(addressOutput);
    address _thisContract = address(this);

    require(msg.sender == owner, "Your address in not owner.");
    require(coins <= _thisContract.balance, "There are not so many coins.");
    
    _to.transfer(_thisContract.balance);
    revert("The funds were transferred.");
  }


  /// function that returns an array of unique funder addresses
  function getAccountsOfDonors() public view returns(address[] memory) {
    return uniqFunders;
  }


  /// function that returns the amount of donations to a specific address
  function amountOfAccountDonations(address addressFunder) public view returns(uint256) {
    return funders[addressFunder].amount;
  }

}
