import { create } from "ipfs-http-client";

const projectId = process.env.REACT_APP_INFURA_PROJECT_ID;
const projectSecret = process.env.REACT_APP_INFURA_PROJECT_SECRET;
const auth = `Basic ${btoa(`${projectId}:${projectSecret}`)}`;

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: { authorization: auth },
});

export const uploadToIPFS = async (image, certificateName, category, recipient) => {
  try {
    const imageAdded = await client.add(image);
    const imageUrl = `https://ipfs.infura.io/ipfs/${imageAdded.path}`;

    const metadata = {
      name: certificateName,
      description: `Certificate for ${recipient}`,
      image: imageUrl,
      attributes: [
        { trait_type: "Category", value: category },
        { trait_type: "Recipient", value: recipient },
      ],
    };

    const metadataAdded = await client.add(JSON.stringify(metadata));
    return `https://ipfs.infura.io/ipfs/${metadataAdded.path}`;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
};