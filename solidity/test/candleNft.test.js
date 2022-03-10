const CandleNft = artifacts.require("./CandleNft.sol");
const { assert } = require("chai");
const { toWei } = require("web3-utils");
const { reverts } = require("truffle-assertions");

contract("CandleNft", function (accounts) {
  let candleNftInstance;

  before(async function () {
    candleNftInstance = await CandleNft.deployed();
  });

  it("should be able to set floor price", async function () {
    const weiAmount = toWei("0.01", "ether");
    await candleNftInstance.setPrice(weiAmount, { from: accounts[0] });
    const floorPrice = await candleNftInstance.floor_price();
    assert.strictEqual(floorPrice.toString(), weiAmount);
  });

  it("should award a nft", async function () {
    await candleNftInstance.awardItem(accounts[1], "https://images.web3auth.io/1", { from: accounts[1], value: toWei("0.01", "ether") });
    const balance = await candleNftInstance.balanceOf(accounts[1]);
    assert.strictEqual(balance.toString(), "1");
  });
});
