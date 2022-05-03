import * as dotenv from "dotenv";

import { ethers, network, artifacts } from "hardhat";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

async function main() {

  if (network.name === "hardhat") {
    console.warn("You are trying to deploy a contract to the Hardhat " + 
    "gets automativally created and destroyed ever time. " + 
    "Use the Hardhat option '--netwoork localhost'"
    );
  }

  const [deployer] = await ethers.getSigners();

  if (network.name === "rinkeby") {
    const deployer = process.env.ACCOUNT_FOR_DEPLOY_TO_RINKEBY;
  }

  const AcceptingDonations = await ethers.getContractFactory("AcceptingDonations", deployer);
  const donations = await AcceptingDonations.deploy();

  await donations.deployed();

  console.log("AcceptingDonations deployed to:", donations.address);

  saveFrontendFiles({
    AcceptingDonations: donations
  })
}

function saveFrontendFiles(contracts: any) {
  const contractsDir: string = path.join(__dirname, '/..', 'front/contracts');

  if(!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  Object.entries(contracts).forEach((contract_item) => {
    const [name, contract]: [string, any] = contract_item;

    if(contract) {
      fs.writeFileSync(
        path.join(contractsDir, '/', name + '-contract-address.json'),
        JSON.stringify({[name]: contract.address}, undefined, 2),
      )
    }

    const ContractArtifact = artifacts.readArtifactSync(name)
    fs.writeFileSync(
      path.join(contractsDir, '/', name + '.json'),
      JSON.stringify(ContractArtifact, null, 2),
    )
  })
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
