import React, { useState } from "react";
import { getContract } from "../utils/contract";
import { uploadToIPFS } from "../utils/ipfs";
import { ethers } from "ethers";

const MintCertificate = ({ account }) => {
  const [image, setImage] = useState(null);
  const [certificateName, setCertificateName] = useState("");
  const [category, setCategory] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");

  const isFormValid = image && certificateName && category && recipient && ethers.isAddress(recipient);

  const handleMint = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCancelMessage("");
    setLoading(true);

    if (!account) {
      setError("Please connect your wallet");
      setLoading(false);
      return;
    }

    if (!isFormValid) {
      setError("All fields are required and recipient must be a valid Ethereum address");
      setLoading(false);
      return;
    }

    try {
      const tokenURI = await uploadToIPFS(image, certificateName, category, recipient);
      const contract = await getContract();
      const mintFee = ethers.parseEther("0.0001");
      const tx = await contract.mintCertificate(recipient, tokenURI, { value: mintFee });
      await tx.wait();

      setSuccess("Certificate minted successfully!");
      setImage(null);
      setCertificateName("");
      setCategory("");
      setRecipient("");
    } catch (err) {
      if (err.code === 4001 || err.code === "ACTION_REJECTED") {
        setCancelMessage("Transaction was canceled by you");
      } else if (
        err.code === "CALL_EXCEPTION" ||
        err.message.includes("insufficient funds") ||
        err.reason === null
      ) {
        setError("Insufficient Base Sepolia on wallet");
      } else {
        setError("Failed to mint certificate: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopout = () => {
    setSuccess("");
  };

  const handleCloseCancelPopout = () => {
    setCancelMessage("");
  };

  return (
    <div
      className="max-w-md mx-auto p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-100 to-blue-50 border border-gray-200/30 animate-fade-in relative"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CA3AF' fill-opacity='0.1'%3E%3Cpath d='M36 34l24-14L36 6v28z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Mint Certificate
      </h2>
      {error && <p className="text-red-400 mb-4 text-center font-medium">{error}</p>}
      {success && <p className="text-green-400 mb-4 text-center font-medium">{success}</p>}
      <form onSubmit={handleMint} className="space-y-5">
        <div>
          <div className="relative flex justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="image-input"
            />
            <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-blue-500/50 flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Certificate Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">Upload Image</span>
              )}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Certificate Name</label>
          <input
            type="text"
            value={certificateName}
            onChange={(e) => setCertificateName(e.target.value)}
            placeholder="Enter certificate name"
            className="mt-1 block w-full p-3 rounded-lg bg-gray-50 border-none ring-2 ring-blue-500/50 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow hover:shadow-md"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full p-3 rounded-lg bg-gray-50 border-none ring-2 ring-blue-500/50 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow hover:shadow-md"
          >
            <option value="" className="bg-white">Select category</option>
            <option value="Education" className="bg-white">Education</option>
            <option value="Achievement" className="bg-white">Achievement</option>
            <option value="Certification" className="bg-white">Certification</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Student Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter student wallet address"
            className="mt-1 block w-full p-3 rounded-lg bg-gray-50 border-none ring-2 ring-blue-500/50 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow hover:shadow-md"
          />
        </div>
        <button
          type="submit"
          disabled={!account || !isFormValid || loading}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            isFormValid && account && !loading
              ? "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-md hover:shadow-lg hover:scale-105"
              : "bg-gray-500/50 cursor-not-allowed"
          } transition transform duration-200`}
        >
          {loading ? "Minting..." : "Mint Certificate (0.0001 ETH)"}
        </button>
      </form>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-center text-gray-800 mb-4">
              Minting Your Certificate...
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-500 h-full w-full animate-pulse"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)',
                  backgroundSize: '20px 20px',
                  animation: 'pulse 2s linear infinite, move 1s linear infinite',
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {success && (
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
              Congratulations!
            </h3>
            <p className="text-center text-gray-600 mb-6">
              Your certificate has been successfully minted!
            </p>
            <button
              onClick={handleClosePopout}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold hover:from-green-600 hover:to-teal-700 shadow-md hover:shadow-lg transition transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {cancelMessage && (
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
              Transaction Canceled
            </h3>
            <p className="text-center text-gray-600 mb-6">
              {cancelMessage}
            </p>
            <button
              onClick={handleCloseCancelPopout}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MintCertificate;




// import React, { useState } from "react";
// import { getContract } from "../utils/contract";
// import { uploadToIPFS } from "../utils/ipfs";
// import { ethers } from "ethers";

// const MintCertificate = ({ account }) => {
//   const [image, setImage] = useState(null);
//   const [certificateName, setCertificateName] = useState("");
//   const [category, setCategory] = useState("");
//   const [recipient, setRecipient] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [cancelMessage, setCancelMessage] = useState("");

//   const isFormValid = image && certificateName && category && recipient && ethers.isAddress(recipient);

//   const handleMint = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setCancelMessage("");
//     setLoading(true);

//     if (!account) {
//       setError("Please connect your wallet");
//       setLoading(false);
//       return;
//     }

//     if (!isFormValid) {
//       setError("All fields are required and recipient must be a valid Ethereum address");
//       setLoading(false);
//       return;
//     }

//     try {
//       const tokenURI = await uploadToIPFS(image, certificateName, category, recipient);
//       const contract = await getContract();
//       const mintFee = ethers.parseEther("0.0001");
//       const tx = await contract.mintCertificate(recipient, tokenURI, { value: mintFee });
//       await tx.wait();

//       setSuccess("Certificate minted successfully!");
//       setImage(null);
//       setCertificateName("");
//       setCategory("");
//       setRecipient("");
//     } catch (err) {
//       if (err.code === 4001 || err.code === "ACTION_REJECTED") {
//         setCancelMessage("Transaction was canceled by you");
//       } else {
//         setError("Failed to mint certificate: " + err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClosePopout = () => {
//     setSuccess("");
//   };

//   const handleCloseCancelPopout = () => {
//     setCancelMessage("");
//   };

//   return (
//     <div
//       className="max-w-md mx-auto p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-100 to-blue-50 border border-gray-200/30 animate-fade-in relative"
//       style={{
//         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CA3AF' fill-opacity='0.1'%3E%3Cpath d='M36 34l24-14L36 6v28z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//       }}
//     >
//       <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//         Mint Certificate
//       </h2>
//       {error && <p className="text-red-400 mb-4 text-center font-medium">{error}</p>}
//       {success && <p className="text-green-400 mb-4 text-center font-medium">{success}</p>}
//       <form onSubmit={handleMint} className="space-y-5">
//         <div>
//           {/* <label className="block text-sm font-bold text-gray-800 mb-1">Certificate Image</label> */}
//           <div className="relative flex justify-center">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setImage(e.target.files[0])}
//               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//               id="image-input"
//             />
//             <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-blue-500/50 flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
//               {image ? (
//                 <img
//                   src={URL.createObjectURL(image)}
//                   alt="Certificate Preview"
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <span className="text-gray-500 text-sm">Upload Image</span>
//               )}
//             </div>
//           </div>
//         </div>
//         <div>
//           <label className="block text-sm font-bold text-gray-800 mb-1">Certificate Name</label>
//           <input
//             type="text"
//             value={certificateName}
//             onChange={(e) => setCertificateName(e.target.value)}
//             placeholder="Enter certificate name"
//             className="mt-1 block w-full p-3 rounded-lg bg-gray-50 border-none ring-2 ring-blue-500/50 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow hover:shadow-md"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-bold text-gray-800 mb-1">Category</label>
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="mt-1 block w-full p-3 rounded-lg bg-gray-50 border-none ring-2 ring-blue-500/50 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow hover:shadow-md"
//           >
//             <option value="" className="bg-white">Select category</option>
//             <option value="Education" className="bg-white">Education</option>
//             <option value="Achievement" className="bg-white">Achievement</option>
//             <option value="Certification" className="bg-white">Certification</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-bold text-gray-800 mb-1">Student Address</label>
//           <input
//             type="text"
//             value={recipient}
//             onChange={(e) => setRecipient(e.target.value)}
//             placeholder="Enter student wallet address"
//             className="mt-1 block w-full p-3 rounded-lg bg-gray-50 border-none ring-2 ring-blue-500/50 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-400 transition-shadow hover:shadow-md"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={!account || !isFormValid || loading}
//           className={`w-full py-3 rounded-lg text-white font-semibold ${
//             isFormValid && account && !loading
//               ? "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-md hover:shadow-lg hover:scale-105"
//               : "bg-gray-500/50 cursor-not-allowed"
//           } transition transform duration-200`}
//         >
//           {loading ? "Minting..." : "Mint Certificate (0.0001 ETH)"}
//         </button>
//       </form>

//       {loading && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
//           <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4">
//             <h3 className="text-lg font-bold text-center text-gray-800 mb-4">
//               Minting Your Certificate...
//             </h3>
//             <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
//               <div
//                 className="bg-blue-500 h-full w-full animate-pulse"
//                 style={{
//                   backgroundImage:
//                     'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)',
//                   backgroundSize: '20px 20px',
//                   animation: 'pulse 2s linear infinite, move 1s linear infinite',
//                 }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       )}

//       {success && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
//           <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-transform duration-300 scale-95 animate-scale-up">
//             <div className="flex justify-center mb-4">
//               <svg
//                 className="w-16 h-16 text-green-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
//               Congratulations!
//             </h3>
//             <p className="text-center text-gray-600 mb-6">
//               Your certificate has been successfully minted!
//             </p>
//             <button
//               onClick={handleClosePopout}
//               className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold hover:from-green-600 hover:to-teal-700 shadow-md hover:shadow-lg transition transform hover:scale-105"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {cancelMessage && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
//           <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-transform duration-300 scale-95 animate-scale-up">
//             <div className="flex justify-center mb-4">
//               <svg
//                 className="w-16 h-16 text-red-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
//               Transaction Canceled
//             </h3>
//             <p className="text-center text-gray-600 mb-6">
//               {cancelMessage}
//             </p>
//             <button
//               onClick={handleCloseCancelPopout}
//               className="w-full py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition transform hover:scale-105"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MintCertificate;