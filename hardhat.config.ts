import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-solhint";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

import { BigNumber } from "@ethersproject/contracts/node_modules/@ethersproject/bignumber";
dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("balance", "Prints an account's balance")
  .addParam("account", "The smart contract's account")
  .setAction(async (taskArgs, hre) => {
    const accountStr: string = taskArgs.account;
    const balance = await hre.ethers.provider.getBalance(accountStr);
    console.log("Account:", accountStr);
    console.log("Balance:", hre.ethers.utils.formatEther(balance), "ETH");
});

task("receive", "Send a donation")
  .addParam("contract", "The smart contract's account")
  .addParam("account", "The account's address")
  .addParam("eth", "The coins donation")
  .setAction(async (taskArgs, hre) => {
    const accountSmartContract: string = taskArgs.contract;
    const accAddress1: string = taskArgs.account;
    const acc1: any = await hre.ethers.getSigner(accAddress1)
    const valueTo: BigNumber = hre.ethers.utils.parseEther(taskArgs.eth);

    const ts = {
      to: accountSmartContract,
      value: valueTo
    }

    const tsSend = await acc1.sendTransaction(ts);
    await tsSend.wait()

    const balance = await hre.ethers.provider.getBalance(accountSmartContract);
    console.log("Contract balance: ", hre.ethers.utils.formatEther(balance), "ETH");
  });

task("transfer", "Send a donation")
  .addParam("contract", "The smart contract's account")
  .addParam("account", "The account's address")
  .addParam("eth", "The coins donation")
  .setAction(async (taskArgs, hre) => {
    const accountSmartContract: string = taskArgs.contract;
    const accAddress1: string = taskArgs.account;
    const acc1: any = await hre.ethers.getSigner(accAddress1)
    const valueTo: BigNumber = hre.ethers.utils.parseEther(taskArgs.eth);

    const TransfersArtifact = require("./artifacts/contracts/AcceptingDonations.sol/AcceptingDonations.json")
    
    const transfersContract = new hre.ethers.Contract(
      accountSmartContract,
      TransfersArtifact.abi,
      acc1
    )

    const ts = {
      value: valueTo
    }

    await transfersContract.transfer(ts);

    console.log(
      "Transfer from ", accAddress1,
      "to", accountSmartContract,
      "coins in quantity", hre.ethers.utils.formatEther(valueTo).toString()
      );
    const balanceContract = await hre.ethers.provider.getBalance(accountSmartContract);
    console.log("Contract balance: ", hre.ethers.utils.formatEther(balanceContract), "ETH");    
  });

task("withdraw", "Send a donation")
  .addParam("contract", "The smart contract's account")
  .addParam("owner", "The smart contract's owner")
  .addParam("account", "The account's address")
  .addParam("eth", "The coins donation")
  .setAction(async (taskArgs, hre) => {
    const accountSmartContract: string = taskArgs.contract;
    const acc1Address: string = taskArgs.account;
    const ownerAddress: string = taskArgs.owner;
    const owner: any = await hre.ethers.getSigner(ownerAddress)
    const acc1: any = await hre.ethers.getSigner(acc1Address)
    const valueTo: BigNumber = hre.ethers.utils.parseEther(taskArgs.eth);
    
    const TransfersArtifact = require("./artifacts/contracts/AcceptingDonations.sol/AcceptingDonations.json");
    const transfersContract = new hre.ethers.Contract(
      accountSmartContract,
      TransfersArtifact.abi,
      owner
    ) 

    const result = await transfersContract.withdraw(acc1.address, valueTo);
    console.log("Contract withdraw: ", result);
});

task("getAccountsOfDonors", "Send a donation")
  .addParam("contract", "The smart contract's account")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs, hre) => {
    const accountSmartContract: string = taskArgs.contract;
    const accAddress1: string = taskArgs.account;
    const acc1: any = await hre.ethers.getSigner(accAddress1)

    const TransfersArtifact = require("./artifacts/contracts/AcceptingDonations.sol/AcceptingDonations.json");
    const transfersContract = new hre.ethers.Contract(
      accountSmartContract,
      TransfersArtifact.abi,
      acc1
    ) 

    const result = await transfersContract.getAccountsOfDonors();
    if(result.lenght === 0) {
      console.log("Not donation contracts.");
    } else {
      console.log("Donation contracts: ");
      for(let i = 0; i < result.length; i += 1) {
        console.log(result[i]);
      }
    }
});

task("amountOfAccountDonations", "Send a donation")
  .addParam("contract", "The smart contract's account")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs, hre) => {
    const accountSmartContract: string = taskArgs.contract;
    const accAddress1: string = taskArgs.account;
    const acc1: any = await hre.ethers.getSigner(accAddress1)

    const TransfersArtifact = require("./artifacts/contracts/AcceptingDonations.sol/AcceptingDonations.json");
    const transfersContract = new hre.ethers.Contract(
      accountSmartContract,
      TransfersArtifact.abi,
      acc1
    ) 

    const result = await transfersContract.amountOfAccountDonations(accAddress1);
    const resultStr: string = hre.ethers.utils.formatEther(result).toString();
    if(resultStr === "0") {
      console.log("Account", accAddress1, "doesn't donation to the smart contract.");
      return
    }
    console.log("Donation contract: ", accAddress1);
    console.log("ETH: ", resultStr);
});


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: process.env.RENKEBY_URL || '',
      accounts: process.env.RINKEBY_PRIVATE_KEY !== undefined ? [process.env.RINKEBY_PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
