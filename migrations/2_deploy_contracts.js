var Adoption = artifacts.require("Adoption");
var MetaCoin = artifacts.require("MetaCoin");
var ConvertLib = artifacts.require("ConvertLib.sol");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
};