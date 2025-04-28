import React, { useState, useEffect } from "react";
import { getContract } from "../utils/contract";
import axios from "axios";
import NFTCard from "./NFTCard";
import MintCertificate from "./MintCertificate";

const Dashboard = ({ account, isInstitution }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!account) return;

      setLoading(true);
      try {
        const contract = await getContract();
        const balance = await contract.balanceOf(account);
        const ownedNFTs = [];

        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(account, i);
          const tokenURI = await contract.tokenURI(tokenId);
          const response = await axios.get(tokenURI);
          ownedNFTs.push({ tokenId: tokenId.toString(), metadata: response.data });
        }

        setNfts(ownedNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
      setLoading(false);
    };

    fetchNFTs();
  }, [account]);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
        {isInstitution ? "Institution Dashboard" : "Student Dashboard"}
      </h2>
      {isInstitution && <MintCertificate account={account} />}
      {!account ? (
        <p className="text-center text-gray-600 animate-fade-in">
          Please connect your wallet to view your certificates.
        </p>
      ) : loading ? (
        <p className="text-center text-gray-600 animate-pulse">Loading...</p>
      ) : nfts.length === 0 ? (
        <p className="text-center text-gray-600 animate-fade-in">No certificates found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <NFTCard key={nft.tokenId} nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;