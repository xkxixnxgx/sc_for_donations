// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AcceptingDonations
{

  struct Funder {
    address addr;
    uint amount;
  }

  address payable public owner;
  constructor() payable {
        owner = payable(msg.sender);
    }

  mapping (address => Funder) public funders;
  address[] public uniqueFunders;
  
  /// - внести пожертвование
  function transfer(address sender, uint256 weis) public returns (bool) {
    if (sender.balance == weis) {
      owner.transfer(weis);

      uint coinsResult = weis;
      Funder memory mark = funders[msg.sender];
      if (mark.addr == sender) {
        coinsResult = funders[sender].amount + weis;
        funders[msg.sender].amount = coinsResult;
      }
      funders[msg.sender] = Funder({addr: msg.sender, amount: weis});
      uniqueFunders.push(sender);

      revert("Transfer from the address.");

    } else {
      revert("Insufficient funds in the account.");
    }
  }


  /// - вывести любую сумму на любой адрес
  function withdrawal(address to, uint256 weis) public returns (bool) {
    require(msg.sender == owner);
    require(owner.balance == weis);
    owner.transfer(weis);
    revert("The funds were transferred.");
  }


  /// - view функция, возвращающая список адресов, с которых вносились пожертвования (без повторений)
  function getAccountsOfDonors() public view returns(address[] memory fundersArray) {
    return uniqueFunders;
  }


  /// - view функция, возвращающая сумму пожертвований для определенного адреса
  function amountOfAccountDonations(address addressFunder) public view returns(uint weis) {
    Funder memory funder = funders[addressFunder];
    if (funder.addr == addressFunder) {
      revert("The amount of wei deposited from this account.");
      return funder.amount;
    }
    revert("This account did not make donations.");
  }

  function deposit() public payable {}

}
