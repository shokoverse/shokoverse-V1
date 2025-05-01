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

  const isFormValid = image && certificateName && category && recipient && ethers.isAddress(recipient);

  const handleMint = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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
      setError("Failed to mint certificate: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto  border-2 border-blue-950 p-6 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Mint Certificate
      </h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
      <form onSubmit={handleMint} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Certificate Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Certificate Name</label>
          <input
            type="text"
            value={certificateName}
            onChange={(e) => setCertificateName(e.target.value)}
            placeholder="Enter certificate name"
            className="mt-1 block w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select category</option>
            <option value="Education">Education</option>
            <option value="Achievement">Achievement</option>
            <option value="Certification">Certification</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Student Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter student wallet address"
            className="mt-1 block w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={!account || !isFormValid || loading}
          className={`w-full py-3 rounded-lg text-white ${
            isFormValid && account && !loading
              ? "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
              : "bg-gray-400 cursor-not-allowed"
          } transition animate-scale-up`}
        >
          {loading ? "Minting..." : "Mint Certificate (0.0001 ETH)"}
        </button>
      </form>
    </div>
  );
};

export default MintCertificate;