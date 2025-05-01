import React, { useState, useEffect } from "react";
import { getContract } from "../utils/contract";
import axios from "axios";
import NFTDisplayCard from "./NFTDisplayCard";
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
        let contractAddress = null;
        let chainName = "Unknown Chain";
        let providerAvailable = false;

        // Attempt to initialize ethers and get chain info
        try {
          const ethers = await import("ethers");
          if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            contractAddress = contract.address;
            const chainId = (await provider.getNetwork()).chainId;
            chainName = getChainName(chainId);
            providerAvailable = true;
            console.log(
              `Provider detected: Chain ${chainName}, Contract ${contractAddress}`
            );
          } else {
            console.warn("No wallet provider (e.g., MetaMask) detected");
          }
        } catch (err) {
          console.warn("Failed to initialize ethers or provider:", err.message);
        }

        const balance = await contract.balanceOf(account);
        console.log(`Wallet ${account} owns ${balance} NFTs`);

        // Convert balance to number for comparison
        const balanceNum = Number(balance);
        if (isNaN(balanceNum) || balanceNum <= 0) {
          setNfts([]);
          setLoading(false);
          return;
        }

        const ownedNFTs = [];
        const pinataJWT = import.meta.env.VITE_PINATA_JWT;

        for (let i = 0; i < balanceNum; i++) {
          try {
            const tokenId = await contract.tokenOfOwnerByIndex(account, i);
            const tokenURI = await contract.tokenURI(tokenId);
            console.log(`Token ID ${tokenId}: tokenURI = ${tokenURI}`);

            // Initialize NFT object with basic details
            const nft = {
              tokenId: tokenId.toString(),
              contractAddress: contractAddress || "Unknown Contract",
              chain: chainName,
            };

            // Attempt to fetch metadata if pinataJWT is available
            if (pinataJWT && tokenURI && tokenURI.startsWith("https://")) {
              try {
                const response = await axios.get(tokenURI, {
                  headers: {
                    Authorization: `Bearer ${pinataJWT}`,
                  },
                });
                const metadata = response.data;

                if (
                  metadata &&
                  typeof metadata === "object" &&
                  !Array.isArray(metadata)
                ) {
                  nft.metadata = {
                    name: metadata.name || "Unknown",
                    image: metadata.image || null,
                    attributes: Array.isArray(metadata.attributes)
                      ? metadata.attributes
                      : [],
                  };
                  console.log(`Metadata for tokenId ${tokenId}:`, nft.metadata);
                } else {
                  console.warn(
                    `Invalid metadata for tokenId ${tokenId}:`,
                    metadata
                  );
                }
              } catch (err) {
                console.warn(
                  `Failed to fetch metadata for tokenId ${tokenId}:`,
                  err.message
                );
              }
            } else {
              console.warn(
                `Skipping metadata fetch for tokenId ${tokenId}: Invalid tokenURI or missing pinataJWT`
              );
            }

            ownedNFTs.push(nft);
            console.log(`NFT object for tokenId ${tokenId}:`, nft);
          } catch (err) {
            console.error(`Error fetching NFT for tokenId ${i}:`, err.message);
            continue;
          }
        }

        setNfts(ownedNFTs);
        console.log(`Final NFTs array:`, ownedNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [account]);

  // Helper function to map chainId to chain name
  const getChainName = (chainId) => {
    const chainMap = {
      1: "Ethereum Mainnet",
      3: "Ropsten",
      4: "Rinkeby",
      5: "Goerli",
      137: "Polygon Mainnet",
      80001: "Polygon Mumbai",
    };
    return chainMap[chainId] || `Unknown Chain (ID: ${chainId})`;
  };

  return (
    <div className="h-[90vh] w-full py-8 ">
      <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
        {isInstitution ? "Institution Dashboard" : "Student Dashboard"}
      </h2>
      {isInstitution && <MintCertificate account={account} />}
      {!account ? (
        <p className="text-center text-red-600 animate-fade-in">
          Please connect your wallet to view your certificates.
        </p>
      ) : loading ? (
        <p className="text-center text-gray-600 animate-pulse">Loading...</p>
      ) : nfts.length === 0 ? (
        <p className="text-center text-gray-600 animate-fade-in">
          No valid certificates found.
        </p>
      ) : (
        <div className="flex justify-center gap-4">
         <div class="flex justify-center items-center">
    <div class="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg p-6 m-auto">
      <div className="h-32 -32 rounded-full bg-white text-black font-bold text-center ">
        Profile</div>      
      <h2 class="text-2xl font-bold mb-2">User Name:</h2>
      <p class="text-lg font-medium">Location:</p>
    </div>
  </div>
          <div className="flex flex-wrap gap-3.5 ">
            {nfts.map((nft) => (
              <NFTDisplayCard key={nft.tokenId} nft={nft} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { getContract } from "../utils/contract";
// import axios from "axios";
// import NFTCard from "./NFTCard";
// import MintCertificate from "./MintCertificate";
// import { ethers } from "ethers"; // For BigNumber handling

// const Dashboard = ({ account, isInstitution }) => {
//   const [nfts, setNfts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchNFTs = async () => {
//       if (!account) return;

//       setLoading(true);
//       try {
//         const contract = await getContract();
//         const balance = await contract.balanceOf(account);
//         console.log(`Wallet ${account} owns ${balance} NFTs`);

//         if (balance.eq(0)) {
//           setNfts([]);
//           setLoading(false);
//           return;
//         }

//         const ownedNFTs = [];

//         const pinataJWT = import.meta.env.VITE_PINATA_JWT;
//         if (!pinataJWT) {
//           throw new Error("Pinata JWT is not defined. Check VITE_PINATA_JWT in .env");
//         }

//         for (let i = 0; i < balance; i++) {
//           try {
//             const tokenId = await contract.tokenOfOwnerByIndex(account, i);
//             const tokenURI = await contract.tokenURI(tokenId);
//             console.log(`Token ID ${tokenId}: tokenURI = ${tokenURI}`);

//             // Validate tokenURI
//             if (!tokenURI || !tokenURI.startsWith("https://")) {
//               console.warn(`Invalid tokenURI for tokenId ${tokenId}: ${tokenURI}`);
//               continue;
//             }

//             // Fetch metadata from Pinata
//             const response = await axios.get(tokenURI, {
//               headers: {
//                 Authorization: `Bearer ${pinataJWT}`,
//               },
//             });

//             // Validate metadata
//             const metadata = response.data;
//             if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
//               console.warn(`Invalid metadata for tokenId ${tokenId}:`, metadata);
//               continue;
//             }

//             // Ensure required fields exist
//             if (!metadata.name || !metadata.image || !Array.isArray(metadata.attributes)) {
//               console.warn(`Missing required fields (name, image, or attributes) for tokenId ${tokenId}:`, metadata);
//               continue;
//             }

//             // Construct nft object
//             const nft = { tokenId: tokenId.toString(), metadata };
//             console.log(`NFT object for tokenId ${tokenId}:`, nft);

//             ownedNFTs.push(nft);
//           } catch (err) {
//             console.error(`Error fetching NFT for tokenId ${i}:`, err.response?.data || err.message);
//             continue;
//           }
//         }

//         setNfts(ownedNFTs);
//         console.log(`Final NFTs array:`, ownedNFTs);
//       } catch (error) {
//         console.error("Error fetching NFTs:", error.response?.data || error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNFTs();
//   }, [account]);

//   return (
//     <div className="max-w-6xl mx-auto py-8">
//       <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
//         {isInstitution ? "Institution Dashboard" : "Student Dashboard"}
//       </h2>
//       {isInstitution && <MintCertificate account={account} />}
//       {!account ? (
//         <p className="text-center text-gray-600 animate-fade-in">
//           Please connect your wallet to view your certificates.
//         </p>
//       ) : loading ? (
//         <p className="text-center text-gray-600 animate-pulse">Loading...</p>
//       ) : nfts.length === 0 ? (
//         <p className="text-center text-gray-600 animate-fade-in">No valid certificates found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {nfts.map((nft) => (
//             <NFTCard key={nft.tokenId} nft={nft} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { getContract } from "../utils/contract";
// import axios from "axios";
// import NFTCard from "./NFTCard";
// import MintCertificate from "./MintCertificate";

// const Dashboard = ({ account, isInstitution }) => {
//   const [nfts, setNfts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchNFTs = async () => {
//       if (!account) return;

//       setLoading(true);
//       try {
//         const contract = await getContract();
//         const balance = await contract.balanceOf(account);
//         const ownedNFTs = [];

//         const pinataJWT = import.meta.env.VITE_PINATA_JWT;
//         if (!pinataJWT) {
//           throw new Error("Pinata JWT is not defined. Check VITE_PINATA_JWT in .env");
//         }

//         for (let i = 0; i < balance; i++) {
//           try {
//             const tokenId = await contract.tokenOfOwnerByIndex(account, i);
//             const tokenURI = await contract.tokenURI(tokenId);
//             console.log(`Fetching tokenURI: ${tokenURI}`); // Debug log

//             // Fetch metadata from Pinata
//             const response = await axios.get(tokenURI, {
//               headers: {
//                 Authorization: `Bearer ${pinataJWT}`,
//               },
//             });

//             // Validate the response data
//             const nftData = response.data;
//             if (!nftData || typeof nftData !== "object") {
//               console.warn(`Invalid NFT data for tokenId ${tokenId}:`, nftData);
//               continue; // Skip invalid data
//             }

//             // Ensure attributes exist, even if empty
//             if (!nftData.attributes) {
//               nftData.attributes = [];
//             }

//             // Add tokenId to the NFT object for uniqueness
//             ownedNFTs.push({ tokenId: tokenId.toString(), ...nftData });
//             console.log(`NFT data for tokenId ${tokenId}:`, nftData);
//           } catch (err) {
//             console.error(`Error fetching NFT for tokenId ${i}:`, err.response?.data || err.message);
//             continue; // Skip failed NFT fetch
//           }
//         }

//         setNfts(ownedNFTs);
//       } catch (error) {
//         console.error("Error fetching NFTs:", error.response?.data || error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNFTs();
//   }, [account]);

//   return (
//     <div className="max-w-6xl mx-auto py-8 ">
//       <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
//         {isInstitution ? "Institution Dashboard" : "Student Dashboard"}
//       </h2>
//       {isInstitution && <MintCertificate account={account} />}
//       {!account ? (
//         <p className="text-center text-gray-600 animate-fade-in">
//           Please connect your wallet to view your certificates.
//         </p>
//       ) : loading ? (
//         <p className="text-center text-gray-600 animate-pulse">Loading...</p>
//       ) : nfts.length === 0 ? (
//         <p className="text-center text-gray-600 animate-fade-in">No certificates found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {nfts.map((nft) => (
//             <NFTCard key={nft.tokenId} nft={nft} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
