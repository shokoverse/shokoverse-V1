import React, { useState, useEffect } from "react";
import { getContract } from "../utils/contract";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NFTDisplayCard from "./NFTDisplayCard";
import MintCertificate from "./MintCertificate";

const Dashboard = ({ account, isInstitution }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unauthorizedMessage, setUnauthorizedMessage] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [connectWalletMessage, setConnectWalletMessage] = useState("");
  const navigate = useNavigate();

  // Array of authorized wallet addresses for institution route
  const authorizedWallets = [
    "0x43d9F129426b82759C0206BEcf400aAc024Bf5ED",
    "0xabcdef1234567890abcdef1234567890abcdef12",
    "0x7890abcdef1234567890abcdef1234567890abcd",
  ];

  useEffect(() => {
    setUnauthorizedMessage("");
    setWelcomeMessage("");
    setConnectWalletMessage("");

    // Check wallet connection and authorization
    if (!account) {
      setConnectWalletMessage("Please connect your wallet to view your certificates.");
      return;
    }

    if (isInstitution) {
      const isAuthorized = authorizedWallets.some(
        (wallet) => wallet.toLowerCase() === account.toLowerCase()
      );
      if (!isAuthorized) {
        setUnauthorizedMessage("You are not authorized to create certificates.");
      } else {
        setWelcomeMessage("Welcome, Authorized Institution!");
        // Auto-dismiss welcome popout after 2 seconds
        const timer = setTimeout(() => {
          setWelcomeMessage("");
        }, 2000);
        return () => clearTimeout(timer);
      }
    }

    // Fetch NFTs
    const fetchNFTs = async () => {
      setLoading(true);
      try {
        const contract = await getContract();
        let contractAddress = null;
        let chainName = "Unknown Chain";
        let providerAvailable = false;

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

            const nft = {
              tokenId: tokenId.toString(),
              contractAddress: contractAddress || "Unknown Contract",
              chain: chainName,
            };

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
  }, [account, isInstitution]);

  // Listen for wallet disconnection (institution only)
  useEffect(() => {
    if (!window.ethereum || !isInstitution) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        console.log("Wallet disconnected, redirecting to /getstarted");
        navigate("/getstarted");
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [isInstitution, navigate]);

  // Redirect for institution popouts
  useEffect(() => {
    if (isInstitution && (connectWalletMessage || unauthorizedMessage)) {
      const timer = setTimeout(() => {
        navigate("/getstarted");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [connectWalletMessage, unauthorizedMessage, isInstitution, navigate]);

  const handleCloseConnectWalletPopout = () => {
    setConnectWalletMessage("");
  };

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
    <div className="md:h-[90vh] h-full w-full py-8">
      <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
        {isInstitution ? "Institution Dashboard" : "Student Dashboard"}
      </h2>

      {connectWalletMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-transform duration-300 scale-95 animate-scale-up">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
              Wallet Not Connected
            </h3>
            <p className="text-center text-gray-600 mb-4">
              {connectWalletMessage}
            </p>
            {isInstitution ? (
              <p className="text-center text-gray-500 text-sm">
                Redirecting to Get Started...
              </p>
            ) : (
              <button
                onClick={handleCloseConnectWalletPopout}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition transform hover:scale-105"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {unauthorizedMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-transform duration-300 scale-95 animate-scale-up">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
              Unauthorized Access
            </h3>
            <p className="text-center text-gray-600 mb-4">
              {unauthorizedMessage}
            </p>
            <p className="text-center text-gray-500 text-sm">
              Redirecting to Get Started...
            </p>
          </div>
        </div>
      )}

      {welcomeMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-transform duration-300 scale-95 animate-scale-up">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
              Welcome
            </h3>
            <p className="text-center text-gray-600 mb-6">
              {welcomeMessage}
            </p>
          </div>
        </div>
      )}

      {account &&
        (isInstitution
          ? authorizedWallets.some(
              (wallet) => wallet.toLowerCase() === account.toLowerCase()
            ) && <MintCertificate account={account} />
          : !loading && (
              <div className="flex flex-col md:flex-row justify-center gap-4 border-2 w-fit m-auto p-3.5 mt-5 border-purple-500 rounded-2xl">
                <div className="flex justify-center items-center">
                  <div className="bg-gradient-to-r md:w-[250px] from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg p-6 m-auto w-full">
                    <div className="h-32 -32 rounded-full bg-white text-black font-bold text-center flex justify-center">
                      <svg
                        className="w-[100px] h-[100px] text-black text-center m-auto"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold my-2">User Name:</h2>
                    <p className="text-lg font-medium">UserID:</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3.5">
                  {nfts.map((nft) => (
                    <NFTDisplayCard key={nft.tokenId} nft={nft} />
                  ))}
                </div>
              </div>
            ))}
      {account && loading && (
        <p className="text-center text-gray-600 animate-pulse">Loading...</p>
      )}
      {account && !loading && nfts.length === 0 && (
        <p className="text-center text-gray-600 animate-fade-in">
          No valid certificates found.
        </p>
      )}
    </div>
  );
};

export default Dashboard;