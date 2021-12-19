const HDWalletProvider = require("truffle-hdwallet-provider");
const path = require("path");
const secret = require("./secret.json");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545,
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(secret.mnemonic, secret.url);
      },
      network_id: 3,
      gas: 4500000,
      gasPrice: 10000000000,
    },
  },
  compilers: {
    solc: {
      version: "^0.8.9",
    },
  },
};
