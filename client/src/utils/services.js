import { ethers } from "ethers";
import ElectionContract from "../contracts/Election.json";
// import getWeb3 from "./getWeb3";
import Web3 from "web3";

const handleConnect = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.BrowserProvider(window?.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const selectedAccount = accounts[0];
      return selectedAccount;
    } catch (err) {
      console.error("Error connect :", err);
    }
  }
};

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Accounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:7545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    });
  });

const loadWeb3 = async (addess, setContract) => {
  try {
    // const web3 = await getWeb3();
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
    const web3 = new Web3(provider);
    const instance = new web3.eth.Contract(
      ElectionContract.abi,
      "0xA0BFa87409000658b741F04986Dc111B8D708c8B"
    );
    const res = await instance?.methods.user(addess).call();
    setContract(instance);

    if (parseInt(res) === 0) {
      localStorage.setItem("role", "doctor");
      return "doctor";
    } else if (parseInt(res) === 2) {
      localStorage.setItem("role", "owner");
      return "owner";
    } else if (parseInt(res) === 1) {
      localStorage.setItem("role", "patient");
      return "patient";
    } else {
      localStorage.removeItem("role");
      return null;
    }
  } catch (error) {
    return null;
    console.error("Error:", error);
  }
};

const solServices = {
  handleConnect,
  getWeb3,
  loadWeb3,
};

export default solServices;
