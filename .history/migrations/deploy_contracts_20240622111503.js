// 2_deploy_contracts.js
const GiftBox = artifacts.require("GiftBox");

module.exports = function(deployer) {
  deployer.deploy(GiftBox);
};