import { expect } from "chai";
import { ethers, waffle } from "hardhat";

import AcceptingDonationsArtifact from '../artifacts/contracts/AcceptingDonations.sol/AcceptingDonations.json';
import {AcceptingDonations} from '../typechain/AcceptingDonations';

const {deployContract} = waffle;


describe('AcceptingDonations', function () {
  let donations: AcceptingDonations;

  it("Should return the new greeting once it's changed", async function () {
    const signers = await ethers.getSigners();
    donations = (await deployContract(signers[0], AcceptingDonationsArtifact, ['Hello, world!'])) as AcceptingDonations;

    expect(await donations.transfer("0x70997970c51812dc3a010c7d01b50e0d17dc79c8", 23000)).to.equal('Hello, world!');

    // const setGreetingTx = await donations.setGreeting('Hello, world!');

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    expect(await donations.withdrawal("0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc", 23000)).to.equal('Hello, world!');
    expect(await donations.getAccountsOfDonors()).to.equal('Hello, world!');
    expect(await donations.amountOfAccountDonations("0x70997970c51812dc3a010c7d01b50e0d17dc79c8")).to.equal('Hello, world!');
  });
});
