import React, { useEffect, useState } from 'react';
import './head.css';

const images = [
  '/images/digital cert.png',
  '/images/images.jpeg',
  '/images/validator.jpeg',
];

const Head = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="shk__header section__padding" id="home">
      <div className="shk__header-content">
        <h1 className="gradient__text">A New Standard For Digital Certification</h1>
        <p>Issue, share and verify blockchain-secured credentials with speed, trust and global reach. Built for the institutions of today and the learners of tomorrow</p>
      </div>

      <div className="shk__header-image">
        <img src={images[currentImageIndex]} alt="Certification Visual" />
      </div>
    </div>
  );
};

export default Head;
