# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project is a completed test task.
The purpose of the test task is to write a smart contract that can be deployed in the local hardhat network or in the rinkeby network and has the following functions:
- accepts ETH coins to the smart contract account using the function or by direct transaction, for example via Metamask from any account
- allows the contract owner (and only him) to withdraw any amount from the contract to any account
- anyone who wants to see a list of accounts that have ever made donations to a smart contract
- anyone who wants to see the sum of all donations from any account

## Work in hatdhat local network.

### Bootstrap.
```shell
npm run compile
```

### Run hardhat node in a separate terminal.
```shell
npm run node
```

#### Here you can also see a list of ready-made accounts with test ETH coins. The smart contract will be deployed on behalf of the first address in the list, which will be the owner of the smart contract. The remaining addresses can be used to test the operation of the smart contract.

### In another terminal, run the command for deploy.
```shell
npm run deploy.AcceptingDonations
```

#### Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` to call subsequent commands.

### Now you can call smart contract functions.

#### Checking the balance of a smart contract or any other account on the network.
```shell
npx hardhat balance --network localhost --account <ANY_ADDRESS>
```

#### Checking the balance of a smart contract or any other account on the network.
```shell
npx hardhat balance --network localhost --account <ANY_ADDRESS>
```

#### Send coins directly via receive.
```shell
npx hardhat receive --network localhost --contract <DEPLOYED_CONTRACT_ADDRESS>  --account <ANY_ADDRESS> --eth <ETH>
```

#### Send coins via the function.
```shell
npx hardhat transfer --network localhost --contract <DEPLOYED_CONTRACT_ADDRESS> --account <ANY_ADDRESS> --eth <ETH>
```

#### Send coins via the function.
```shell
npx hardhat transfer --network localhost --contract <DEPLOYED_CONTRACT_ADDRESS> --account <ANY_ADDRESS> --eth <ETH>
```

#### Transfer coins from a smart contract to an arbitrary address. The function is available only for the owner of the smart contract.
```shell
npx hardhat withdraw --network localhost --contract <DEPLOYED_CONTRACT_ADDRESS> --owner <OWNER_ADDRESS>  --account <ANY_ADDRESS> --eth <ETH>
```

####  View a list of all accounts that have deposited coins to the smart contract.
```shell
npx hardhat getAccountsOfDonors --network localhost --contract <DEPLOYED_CONTRACT_ADDRESS>  --account <ANY_ADDRESS>
```

####  View the amount of all donations of a certain account.
```shell
npx hardhat amountOfAccountDonations --network localhost --contract <DEPLOYED_CONTRACT_ADDRESS>  --account <ANY_ADDRESS>
```

## Work in rinkeby test network.
### Bootstrap.

#### Create accounts on Metamask.
#### Add the Rinkeby test network to Metamask.
#### Add test coins from the Rinkeby tap.
`https://faucets.chain.link/rinkeby`

#### Compile the bytecode based on the smart contract .sol file.
```shell
npm run compile
```

#### In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Rinkeby node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract.

##### In another terminal, run the command for deploy in rinkeby test network.
```shell
npm run deploy.AcceptingDonations:rinkeby
```

#### Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` to call subsequent commands.

#### To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Rinkeby.
##### Check smart contract in rinkeby network.
```shell
npx hardhat verify --network rinkeby <DEPLOYED_CONTRACT_ADDRESS>
```

### Now you can work with a smart contract via Metamask and call some smart contract functions.

#### Checking the balance of a smart contract or any other account on the network.
```shell
npx hardhat balance --network rinkeby --account <ANY_ADDRESS>
```

#### Send coins to a smart contract via Metamask.
#### Transfer coins from a smart contract to an arbitrary address. The function is available only for the owner of the smart contract.
####  View a list of all accounts that have deposited coins to the smart contract.
####  View the amount of all donations of a certain account.

## For development.

#### View the list of network accounts.
```shell
npm run accounts
```
#### Run tests or test-coverage.
```shell
npm run test
npm run test-coverage 
```
#### Start hardhat node.
```shell
npm run chain
```
#### To compile the entire project, building your smart contracts.
```shell
npm run compile
```
#### To clean the cache and delete compiled smart contracts.
```shell
npm run clean
```
#### To run a deploy script in a local network.
```shell
npm run deploy.AcceptingDonations
```
#### To run a deploy script in a rinkeby network.
```shell
npm run deploy.AcceptingDonations:rinkeby
```

#### Code analyzers and autoformatting.
```shell
npm run lint
npm run prettier
npm run prettier-write
npm run solhint
npm run solhint-fix
```
