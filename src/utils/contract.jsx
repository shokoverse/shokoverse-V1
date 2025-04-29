import { ethers } from "ethers";
import CertificateNFTABI from "./CertificateNFT.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, CertificateNFTABI, signer);
  return contract;
};

export const getProvider = () => {
  return new ethers.BrowserProvider(window.ethereum);
};