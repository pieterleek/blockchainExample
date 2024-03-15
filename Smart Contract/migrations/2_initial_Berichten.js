const Berichten = artifacts.require("Berichten.sol");

module.exports = function (deployer) {
  deployer.deploy(Berichten);
};
