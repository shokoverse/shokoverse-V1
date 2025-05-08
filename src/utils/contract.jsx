import { ethers } from 'ethers';
import CertificateNFTABI from './CertificateNFT.json';

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const baseSepoliaChainId = '84532';
const baseSepoliaRpcUrl = 'https://sepolia.base.org'; // Or use Alchemy/Infura for reliability

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask');
  }

  if (!contractAddress) {
    throw new Error('Contract address not defined. Check VITE_CONTRACT_ADDRESS in .env');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  // Request MetaMask to switch to Base Sepolia
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${parseInt(baseSepoliaChainId).toString(16)}` }], // Convert Chain ID to hex
    });
  } catch (switchError) {
    // If chain is not added, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${parseInt(baseSepoliaChainId).toString(16)}`,
              chainName: 'Base Sepolia',
              rpcUrls: [baseSepoliaRpcUrl],
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              blockExplorerUrls: ['https://sepolia.basescan.org'],
            },
          ],
        });
      } catch (addError) {
        throw new Error(`Failed to add Base Sepolia network: ${addError.message}`);
      }
    } else {
      throw new Error(`Failed to switch to Base Sepolia: ${switchError.message}`);
    }
  }

  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, CertificateNFTABI, signer);

  // Verify network
  const network = await provider.getNetwork();
  if (network.chainId.toString() !== baseSepoliaChainId) {
    throw new Error('Connected to wrong network. Please switch to Base Sepolia in MetaMask.');
  }

  return contract;
};

export const getProvider = () => {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask');
  }
  return new ethers.BrowserProvider(window.ethereum);
};






// import { ethers } from "ethers";
// import CertificateNFTABI from "./CertificateNFT.json";

// const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
// // console.log(contractAddress);


// export const getContract = async () => {
//   if (!window.ethereum) {
//     throw new Error("Please install MetaMask");
//   }

//   const provider = new ethers.BrowserProvider(window.ethereum);
//   const signer = await provider.getSigner();
//   const contract = new ethers.Contract(contractAddress, CertificateNFTABI, signer);
//   return contract;
// };

// export const getProvider = () => {
//   return new ethers.BrowserProvider(window.ethereum);
// };