import { expect } from "chai";
import { ethers, waffle } from "hardhat";

import AcceptingDonationsArtifact from '../artifacts/contracts/AcceptingDonations.sol/AcceptingDonations.json';
import {AcceptingDonations} from '../typechain/AcceptingDonations';

const {deployContract} = waffle;


describe('AcceptingDonations', function () {
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addr3: any;

  let donations: AcceptingDonations;

  beforeEach(async function() {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    donations = (await deployContract(owner, AcceptingDonationsArtifact)) as AcceptingDonations;
  });

  async function sendCoins(sender: any, amount: number ) {
    const tsData: Object = {
      to: donations.address,
      value: amount,
    }
    const ts = await sender.sendTransaction(tsData);
    await ts.wait();
    return [ts, amount]
  }


  describe('============ Contract deploy Test ============', () => {
    it("Correct smart contract address.", async function() {
      
      expect(donations.address).to.be.properAddress
    });

    it("The balance of the expanded contract is 0.", async function() {
      const balance = await donations.currentBalance();

      expect(balance).to.eq(0);
    });
  });

  describe('============= Event Paid Test =============', () => {
    it("Send a donation to the contract wuthout function.", async function() {
      const [sendCoinsTs, amount] = await sendCoins(addr1, 100);
      await expect(() => sendCoinsTs).to.changeEtherBalances([donations, addr1], [amount, -amount]);
    });

    it("Checking the occurrence of an event and logging correct data.", async function() {
      const [sendCoinsTs, amount] = await sendCoins(addr1, 100);
      await expect(sendCoinsTs).to.emit(donations, "Paid").withArgs(addr1.address, amount);
    });
  });

  describe('============= Recieve Test =============', () => {
    it("Send a donation to the contract wuthout function.", async function() {
      const [sendCoinsTs, amount] = await sendCoins(addr1, 100);
      await expect(() => sendCoinsTs).to.changeEtherBalances([donations, addr1], [amount, -amount]);
    });
  });

  describe('============= Donation Test =============', () => {
    it("Send a donation to the contract.", async function() {
      const sum = 100;
      const transaction = await donations.connect(addr1).transfer({value: sum});
      await transaction.wait();

      await expect(() => transaction).to.changeEtherBalances([addr1, donations], [-sum, sum]);
    });

    it("Sending a donation of 0 coins.", async function() {
      const sum = 0;
      const transaction = await donations.connect(addr1).transfer({value: sum});
      await transaction.wait();

      await expect(() => transaction).to.changeEtherBalances([addr1, donations], [-sum, sum]);
    });
  });

  describe('============= Coin withdrawal Test =============', () => {
    it("Withdraw an arbitrary amount to your (owner) account.", async function() {
      const sumForWithdraw = 50;
      await sendCoins(addr1, 100);
      const transactionToAnyAddr = await donations.connect(owner).withdraw(addr2.address, sumForWithdraw);
      await transactionToAnyAddr.wait();

      await expect(() => transactionToAnyAddr).to.changeEtherBalances(
        [donations, addr2], 
        [-sumForWithdraw, sumForWithdraw]
      );

      const balance = await donations.currentBalance();

      expect(balance).to.eq(50);
    });

    it("Only the contract owner can withdraw the amount.", async function() {
      const sumForWithdraw = 50;
      await sendCoins(addr1, 100);
      const balance = await donations.currentBalance();

      await expect(donations.connect(addr2).withdraw(addr2.address, sumForWithdraw))
        .to.be.revertedWith("Your address in not owner.");
      expect(balance).to.eq(100);
    });

  });

  describe('============= Get accounts of donors Test =============', () => {
    it("Empty list of accounts.", async function() {
      const addressList = await donations.connect(addr3).getAccountsOfDonors();

      expect(addressList).to.be.an('array').that.is.empty;
    });

    it("Address list of donors.", async function() {
      await sendCoins(addr1, 100);
      await sendCoins(addr2, 100);
      const accountsOfDonors = [addr1.address, addr2.address];
      const addressList = await donations.connect(addr3).getAccountsOfDonors();

      expect(accountsOfDonors).to.have.all.members(addressList);
    });

    it("Unique list of accounts.", async function() {
      await sendCoins(addr1, 100);
      await sendCoins(addr1, 100);
      const addressList = await donations.connect(addr3).getAccountsOfDonors();

      expect(addressList).to.have.lengthOf(1);
    });

  });

  describe('============= View amount of account donations Test =============', () => {
    it("Empty amount of any accounts.", async function() {
      const amountDonations = await donations.connect(addr1).amountOfAccountDonations(addr2.address);

      expect(amountDonations).to.eq(0);
    });

    it("The sum of several donations", async function() {
      await sendCoins(addr1, 100);
      await sendCoins(addr1, 100);
      const amountDonations = await donations.connect(addr2).amountOfAccountDonations(addr1.address);

      expect(amountDonations).to.eq(200);
    });

    it("The amounts of donations from different accounts are not confused.", async function() {
      const sumToContractOne = 100;
      const sumToContractTwo = 200;
      await sendCoins(addr1, sumToContractOne);
      await sendCoins(addr2, sumToContractTwo);
      const amountDonationsOne = await donations.connect(addr3).amountOfAccountDonations(addr1.address);
      const amountDonationsTwo = await donations.connect(addr3).amountOfAccountDonations(addr2.address);

      expect(amountDonationsOne).to.eq(sumToContractOne);
      expect(amountDonationsTwo).to.eq(sumToContractTwo);
    });

  });


});
