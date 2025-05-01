import React from "react";

const NFTDisplayCard = ({ nft }) => {
  const { tokenId, contractAddress, chain, metadata } = nft;
  

  // Truncate contract address for display
  const truncatedAddress = `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`;

  // Fallback image if metadata.image is unavailable
  const imageUrl = metadata?.image
    ? metadata.image.startsWith("ipfs://")
      ? `https://purple-official-muskox-784.mypinata.cloud/ipfs/${metadata.image.split("ipfs://")[1]}`
      : `https://purple-official-muskox-784.mypinata.cloud/ipfs/${metadata.image}`
    : "https://via.placeholder.com/150?text=No+Image";

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl animate-fade-in">
      {/* Token ID Badge */}
      <div className="absolute top-0 left-1/2 mt-1.5 transform bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm py-1 px-3 rounded-full shadow-md">
        Token ID: {tokenId}
      </div>

      {/* Image or Placeholder */}
      <img
        src={imageUrl}
        alt={metadata?.name || `NFT`}
        className="w-full h-48 object-cover font-bold"
      />

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
          {metadata?.name || "Unnamed NFT"}
        </h3>
        <div className="mt-2 space-y-2">
          <p className="text-sm text-gray-600 flex items-center">
            <span className="font-medium mr-2">Chain:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {chain}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Contract:</span>{" "}
            <span className="font-mono text-gray-800 truncate">{truncatedAddress}</span>
          </p>
          {metadata?.attributes?.length > 0 && (
            <>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Category:</span>{" "}
                {metadata.attributes[0]?.value || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Recipient:</span>{" "}
                {metadata.attributes[1]?.value
                  ? `${metadata.attributes[1].value.slice(0, 6)}...${metadata.attributes[1].value.slice(-4)}`
                  : "N/A"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Gradient Footer */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1"></div>
    </div>
  );
};

export default NFTDisplayCard;