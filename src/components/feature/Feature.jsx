import React from 'react';
import './feature.css';

const Feature = ({ title, text }) => (
  <div className="shk__features-container__feature">
    <div className="shk__features-container__feature-title">
      <div />
      <h1 className=''>{title}</h1>
    </div>
    <div className="shk__features-container_feature-text">
      <p>{text}</p>
    </div>
  </div>
);

export default Feature;