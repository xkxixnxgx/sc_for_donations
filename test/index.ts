import { expect } from "chai";
import { ethers, waffle } from "hardhat";

import AcceptingDonationsArtifact from '../artifacts/contracts/AcceptingDonations.sol/AcceptingDonations.json';
import {AcceptingDonations} from '../typechain/AcceptingDonations';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';

const {deployContract} = waffle;


describe('AcceptingDonations', function () {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addr3: SignerWithAddress;

  let donations: AcceptingDonations;

  beforeEach(async () => {
    // eslint-disable-next-line no-unused-vars
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  
    donations = (await deployContract(owner, AcceptingDonationsArtifact)) as AcceptingDonations;
  });

  describe('Test transfer', () => {
    it("The contract balance should increase and the account balance should decrease.", async function () {
      const signers = await ethers.getSigners();
      donations = (await deployContract(signers[0], AcceptingDonationsArtifact)) as AcceptingDonations;
      
      const balance = await donations.connect(addr1).transfer("addr1", 23000);
      expect(owner.getBalance()).to.equal(1000023000);
    });
  });
});
