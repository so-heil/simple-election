# Simple Election dApp

### [Live dApp](https://so-heil.github.io/simple-election/)

### [Smart contract on Ropsten](https://ropsten.etherscan.io/address/0x6C1deD674ca1A517B318b4623e1f8ccDa103bBd9)

This is a pretty simple election dApp, users can connect their wallet using tools like meta mask and vote to their chosen candidate. It's all happening on a smart contract written in solidity which can be deployed to many smart contract platforms.

## Technologies Used

- Truffle
- Solidity 0.8.9
- Web3.js
- React
- TypeScript (strongly typed usage of smart contract inside client app, methods and events included)

## How to use

Connect your wallet using metamask, make sure you have selected ropsten testnet as the network since the smart contract is deployed there, you need small amounts of ETH on ropsten you can get on it's faucets, Now vote!

## Run it locally

First you need to run truffle to deploy Election contract on it:

1. install truffle globally `npm i -g truffle`
2. start development blockchain `truffle develop`
3. compile contracts `compile`
4. deploy them `migrate`

Now you can access the smart contract, start react app:

`cd client`

`npm install && npm start`

It should be live on `localhost:3000`
