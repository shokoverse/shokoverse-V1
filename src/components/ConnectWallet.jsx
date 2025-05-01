import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { Popover, Transition } from "@headlessui/react";

const ConnectWallet = ({ setAccount }) => {
  const [account, setLocalAccount] = useState(null);
  const web3Modal = new Web3Modal({
    network: "sepolia",
    cacheProvider: true,
  });

  const connectWallet = async () => {
    try {
      const instance = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(instance);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setLocalAccount(address);
      setAccount(address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = () => {
    web3Modal.clearCachedProvider();
    setLocalAccount(null);
    setAccount(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setLocalAccount(accounts[0] || null);
        setAccount(accounts[0] || null);
      });
    }
  }, [setAccount]);

  return (
    <div className="">
      {account ? (
        <Popover>
          {({ open }) => (
            <>
              <Popover.Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:cursor-pointer text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition animate-fade-in">
                {account.slice(0, 6)}...{account.slice(-4)}
              </Popover.Button>
              <Transition
                show={open}
                enter="transition duration-200 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition duration-150 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Popover.Panel className="absolute z-10 mt-2 w-full hover:cursor-pointer bg-white shadow-lg rounded-lg">
                  <button
                    onClick={disconnectWallet}
                    className="w-full p-3.5 hover:cursor-pointer text-red-600 hover:text-red-800"
                  >
                    Disconnect
                  </button>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:cursor-pointer text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition animate-fade-in"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;