var Election = artifacts.require("./Election.sol");

module.exports = function (deployer) {
  deployer.deploy(Election, [
    "Maria H. Wade",
    "Candy W. Okelly",
    "Elizabeth A. Greene",
    "Kurt S. Cifuentes",
  ]);
};
