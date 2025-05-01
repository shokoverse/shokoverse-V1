import React from "react";

const NFTCard = ({ nft }) => {
  console.log(nft.metadata);
  
  return (
    <div className="bg-black rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl animate-fade-in">
      <img
        src={nft.metadata.image}
        alt={nft.metadata.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {nft.metadata.name}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          <strong>Category:</strong> {nft.metadata.attributes[0].value}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Recipient:</strong> {nft.metadata.attributes[1].value.slice(0, 6)}...
          {nft.metadata.attributes[1].value.slice(-4)}
        </p>
      </div>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1"></div>
    </div>
  );
};

export default NFTCard;




// import React from "react";

// const NFTCard = ({ nft }) => {
//   console.log(nft);
  
//   if (!nft || !nft.attributes) {
//     return <div>Error: Invalid NFT data</div>;
//   }

//   const imageUrl = nft.image.startsWith("ipfs://")
//     ? `https://purple-official-muskox-784.mypinata.cloud/ipfs/${nft.image.split("ipfs://")[1]}`
//     : `https://purple-official-muskox-784.mypinata.cloud/ipfs/${nft.image}`;

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl animate-fade-in">
//       <img
//         src={imageUrl}
//         alt={nft.name}
//         className="w-full h-48 object-cover"
//       />
//       <div className="p-4">
//         <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           {nft.name}
//         </h3>
//         <p className="text-sm text-gray-600 mt-2">
//           <strong>Category:</strong> {nft.attributes[0]?.value || "N/A"}
//         </p>
//         <p className="text-sm text-gray-600">
//           <strong>Recipient:</strong>{" "}
//           {nft.attributes[1]?.value
//             ? `${nft.attributes[1].value.slice(0, 6)}...${nft.attributes[1].value.slice(-4)}`
//             : "N/A"}
//         </p>
//       </div>
//       <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1"></div>
//     </div>
//   );
// };

// export default NFTCard;



