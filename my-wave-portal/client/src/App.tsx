import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState("");
  const contractAddress = "0xd24f4CF845918Baa106208CA5cDeb1Ed3b1a564D";
  const contractABI = abi.abi;

  const checkIfWaffleConnect = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask");
      } else {
        console.log("We have the ETH object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Need a MetaMask wallet");
        return;
      }

      const accounts = ethereum.request({ method: "eth_requestAccounts" });
      console.log("Account connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave("this is a wave");
        console.log("mining", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Total wave counts:", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        /*
         *          * Call the getAllWaves method from your Smart Contract
         *                   */
        const waves = await wavePortalContract.getAllWaves();

        /*
         *          * We only need address, timestamp, and message in our UI so let's
         *                   * pick those out
         *                            */
        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });

        /*
         *          * Store our data in React State
         *                   */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWaffleConnect();
  }, []);

  return (
    <div>
      <div>This is a header</div>
      <button onClick={wave}>Wave at me</button>
      {!currentAccount && (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default App;
