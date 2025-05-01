import axios from 'axios';

const pinataJWT = import.meta.env.VITE_PINATA_JWT;
// console.log('Pinata JWT:', pinataJWT);

export const uploadToIPFS = async (image, certificateName, category, recipient) => {
  try {
    // Validate inputs
    if (!image || !certificateName || !category || !recipient) {
      throw new Error('Missing required parameters for IPFS upload');
    }
    if (!pinataJWT) {
      throw new Error('Pinata JWT is not defined. Check VITE_PINATA_JWT in .env');
    }

    // Upload image
    const imageFormData = new FormData();
    imageFormData.append('file', image);
    imageFormData.append('name', `${certificateName}_image`);
    imageFormData.append('keyvalues', JSON.stringify({
      env: 'prod',
      type: 'certificate'
    }));
    imageFormData.append('network', 'public');

    const imageResponse = await axios.post(
      '/pinata/v3/files',
      imageFormData,
      {
        headers: {
          Authorization: `Bearer ${pinataJWT}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const imageData = imageResponse.data;
    if (!imageData.data || !imageData.data.cid) {
      throw new Error('Failed to upload image to Pinata: ' + JSON.stringify(imageData));
    }
    const imageUrl = `${imageData.data.cid}`;

    // Create metadata
    const metadata = {
      name: certificateName,
      description: `Certificate for ${recipient}`,
      image: imageUrl,
      attributes: [
        { trait_type: 'Category', value: category },
        { trait_type: 'Recipient', value: recipient },
      ],
    };

    // Upload metadata
    const metadataFile = new File(
      [JSON.stringify(metadata)],
      `${certificateName}_metadata.json`,
      { type: 'application/json' }
    );
    const metadataFormData = new FormData();
    metadataFormData.append('file', metadataFile);
    metadataFormData.append('name', `${certificateName}_metadata.json`);
    metadataFormData.append('keyvalues', JSON.stringify({
      env: 'prod',
      type: 'certificate'
    }));
    metadataFormData.append('network', 'public');

    const metadataResponse = await axios.post(
      '/pinata/v3/files',
      metadataFormData,
      {
        headers: {
          Authorization: `Bearer ${pinataJWT}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const metadataData = metadataResponse.data;
    if (!metadataData.data || !metadataData.data.cid) {
      throw new Error('Failed to upload metadata to Pinata: ' + JSON.stringify(metadataData));
    }

    console.log('Upload successful, CID:', metadataData.data.cid);
    return `${metadataData.data.cid}`;
  } catch (error) {
    if (error.response) {
      console.error('Pinata API error:', error.response.data);
    } else if (error.request) {
      console.error('No response from Pinata:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};