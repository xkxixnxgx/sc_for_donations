// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AcceptingDonations {

  /// save the address of the owner of the smart contract in the blockchain
  address public owner;
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

  modifier onlyOwner() {
    require(msg.sender == owner, "Your address in not owner.");
    _;
  }

  modifier saveInfomtionsAboutDonation() {
    if(msg.value != 0) {
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

      emit Paid(msg.sender, msg.value);
    }
    _;
  }

  event Paid(address _from, uint256 _amount);

  fallback() external {

  }

  /// accept funds at the address of the contract
  receive() external payable saveInfomtionsAboutDonation{
  
  }

  /// show contract balance
  function currentBalance() public view returns(uint256) {
    return address(this).balance;
  }


  /// make a donation
  function transfer() public payable saveInfomtionsAboutDonation {
  }


  /// withdraw any amount to any address
  function withdraw(address addressOutput, uint256 weis) public onlyOwner {
    address payable _to = payable(addressOutput);

    _to.transfer(weis);
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
