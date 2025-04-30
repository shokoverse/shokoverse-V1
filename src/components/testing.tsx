
// import axios from 'axios';

// const pinataApiKey = import.meta.env.PINATA_API_KEY;
// const pinataApiSecret = import.meta.env.PINATA_API_SECRET;

// export const uploadToIPFS = async (image, certificateName, category, recipient) => {
//   try {
//     const imageFormData = new FormData();
//     imageFormData.append('file', image);
//     imageFormData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
//     imageFormData.append('pinataMetadata', JSON.stringify({ name: `${certificateName}_image` }));

//     const imageResponse = await axios.post(
//       'https://api.pinata.cloud/pinning/pinFileToIPFS',
//       imageFormData,
//       {
//         headers: {
//           'pinata_api_key': pinataApiKey,
//           'pinata_secret_api_key': pinataApiSecret,
//         },
//       }
//     );
//     const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageResponse.data.IpfsHash}`;

//     const metadata = {
//       name: certificateName,
//       description: `Certificate for ${recipient}`,
//       image: imageUrl,
//       attributes: [
//         { trait_type: 'Category', value: category },
//         { trait_type: 'Recipient', value: recipient },
//       ],
//     };

//     const metadataFormData = new FormData();
//     metadataFormData.append('file', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
//     metadataFormData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
//     metadataFormData.append('pinataMetadata', JSON.stringify({ name: `${certificateName}_metadata` }));

//     const metadataResponse = await axios.post(
//       'https://api.pinata.cloud/pinning/pinFileToIPFS',
//       metadataFormData,
//       {
//         headers: {
//           'pinata_api_key': pinataApiKey,
//           'pinata_secret_api_key': pinataApiSecret,
//         },
//       }
//     );

//     return `https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`;
//   } catch (error) {
//     console.error('Error uploading to IPFS via Pinata:', error);
//     throw error;
//   }
// };





// import axios from 'axios';

// const pinataApiKey = import.meta.env.PINATA_API_KEY;
// const pinataApiSecret = import.meta.env.PINATA_API_SECRET;

// export const uploadToIPFS = async (image, certificateName, category, recipient) => {
//   try {
//     // Upload image to Pinata
//     const imageFormData = new FormData();
//     imageFormData.append('file', image);
//     imageFormData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
//     imageFormData.append('pinataMetadata', JSON.stringify({ name: `${certificateName}_image` }));

//     const imageResponse = await axios.post(
//       'https://api.pinata.cloud/pinning/pinFileToIPFS',
//       imageFormData,
//       {
//         headers: {
//           'pinata_api_key': pinataApiKey,
//           'pinata_secret_api_key': pinataApiSecret,
//         },
//       }
//     );
//     const imageUrl = `https://ipfs.infura.io/ipfs/${imageResponse.data.IpfsHash}`;

//     // Create metadata
//     const metadata = {
//       name: certificateName,
//       description: `Certificate for ${recipient}`,
//       image: imageUrl,
//       attributes: [
//         { trait_type: 'Category', value: category },
//         { trait_type: 'Recipient', value: recipient },
//       ],
//     };

//     // Upload metadata to Pinata
//     const metadataFormData = new FormData();
//     metadataFormData.append('file', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
//     metadataFormData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));
//     metadataFormData.append('pinataMetadata', JSON.stringify({ name: `${certificateName}_metadata` }));

//     const metadataResponse = await axios.post(
//       'https://api.pinata.cloud/pinning/pinFileToIPFS',
//       metadataFormData,
//       {
//         headers: {
//           'pinata_api_key': pinataApiKey,
//           'pinata_secret_api_key': pinataApiSecret,
//         },
//       }
//     );

//     return `https://ipfs.infura.io/ipfs/${metadataResponse.data.IpfsHash}`;
//   } catch (error) {
//     console.error('Error uploading to IPFS via Pinata:', error);
//     throw error;
//   }
// };









// import { create } from "ipfs-http-client";

// const projectId = import.meta.env.VITE_INFURA_PROJECT_ID;
// const projectSecret = import.meta.env.VITE_INFURA_PROJECT_SECRET;
// const auth = `Basic ${btoa(`${projectId}:${projectSecret}`)}`;

// const client = create({
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "https",
//   headers: { authorization: auth },
// });

// export const uploadToIPFS = async (image, certificateName, category, recipient) => {
//   try {
//     const imageAdded = await client.add(image);
//     const imageUrl = `https://ipfs.infura.io/ipfs/${imageAdded.path}`;

//     const metadata = {
//       name: certificateName,
//       description: `Certificate for ${recipient}`,
//       image: imageUrl,
//       attributes: [
//         { trait_type: "Category", value: category },
//         { trait_type: "Recipient", value: recipient },
//       ],
//     };

//     const metadataAdded = await client.add(JSON.stringify(metadata));
//     return `https://ipfs.infura.io/ipfs/${metadataAdded.path}`;
//   } catch (error) {
//     console.error("Error uploading to IPFS:", error);
//     throw error;
//   }
// };