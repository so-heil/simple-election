import Web3 from "web3";

const connectWallet: (
  networkChangeCallback?: (networkId: number | string) => void
) => Promise<Web3> = async (networkChangeCallback) => {
  const ethWindow = window as Window &
    typeof globalThis & {
      ethereum: any;
      web3?: Web3;
    };

  if (ethWindow.ethereum) {
    await ethWindow.ethereum.send("eth_requestAccounts");
    if (networkChangeCallback) {
      ethWindow.ethereum.on("networkChanged", networkChangeCallback);
    }
    return new Web3(ethWindow.ethereum);
  } else if (ethWindow.web3) {
    console.log("Injected web3 detected.");
    return ethWindow.web3;
  } else {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
    console.log("No web3 instance injected, using Local web3.");
    return new Web3(provider);
  }
};

export default connectWallet;
