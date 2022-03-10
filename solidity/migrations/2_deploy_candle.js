const CandleNft = artifacts.require("./CandleNft.sol");

module.exports = function (deployer) {
  deployer.deploy(CandleNft);
};
