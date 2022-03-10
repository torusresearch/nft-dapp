import candle1 from "assets/candle1.json";
import candle2 from "assets/candle2.json";
import nftDetails from "assets/nft_details.json";
import CandleNft from "solidity/build/contracts/CandleNft.json";
import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/web3auth";
import Web3 from "web3";

import "./App.css";
import { network, clientId } from "./config";

const allCandles = [candle1, candle2];

function App() {
  const [web3Auth, setWeb3Auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");

  const buy = async (nft_id) => {
    console.log("buying nft", nft_id);
    const contract = new web3.eth.Contract(CandleNft.abi, nftDetails.contractAddress);
    const currentCandle = allCandles.find((candle) => candle.token_id === nft_id);
    // alert("buying candle" + JSON.stringify(currentCandle));
    const gasEstimate = await contract.methods
      .awardItem(account, currentCandle.hosted_url)
      .estimateGas({ from: account, value: web3.utils.toWei("0.011", "ether") });
    console.log("gas estimate", gasEstimate);

    await contract.methods
      .awardItem(account, currentCandle.hosted_url)
      .send({ from: account, maxPriorityFeePerGas: web3.utils.toWei("1", "gwei"), value: web3.utils.toWei("0.02", "ether") })
      .on("transactionHash", (hash) => console.log(hash));
    alert("successfully claimed");
  };

  useEffect(() => {
    async function init() {
      const web3AuthInstance = new Web3Auth({
        chainConfig: network,
        // get your client id from https://dashboard.web3auth.io
        clientId,
      });
      await web3AuthInstance.initModal();
      setWeb3Auth(web3AuthInstance);
    }
    init();
  }, []);

  const connect = async () => {
    if (!web3Auth) {
      alert("web3auth is not initialized");
      return;
    }
    const provider = await web3Auth.connect();
    setProvider(provider);
    const web3 = new Web3(provider);
    setWeb3(web3);
    const accounts = await web3.eth.getAccounts();
    console.log("accounts", accounts);
    setAccount(accounts[0]);
    const balance = await web3.eth.getBalance(accounts[0]);
    console.log("balance", balance);
    setBalance(web3.utils.fromWei(balance, "ether"));
  };

  const logout = async () => {
    await web3Auth.logout();
    setAccount("");
    setBalance("");
  };
  return (
    <div className="App">
      <header className="App-header">
        {!!account ? (
          <>
            <div>
              <div>Address: {account}</div>
              <div>Balance: {balance} ETH</div>
            </div>
            <div>
              <button onClick={logout}>Logout</button>
            </div>
          </>
        ) : (
          <button onClick={connect}>Connect</button>
        )}

        {allCandles.map((x) => {
          return (
            <div key={x.token_id}>
              <h2>{x.name}</h2>
              <img src={x.image} alt="candle" />
              <p>{x.description}</p>
              <button onClick={() => buy(x.token_id)}>Buy</button>
            </div>
          );
        })}
      </header>
    </div>
  );
}

export default App;
