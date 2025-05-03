import React from 'react';
import { FaBuilding, FaUserGraduate, FaBinoculars } from 'react-icons/fa';
import './cta.css';

const CTA = () => (
  <div className="shk__cta section__padding" id="cta">
    <div className="shk__cta-image">
      <img src='/images/cta.png' alt="cta" />
    </div>
    <div className="shk__cta-content">
      <h1 className="gradient__text">Join the Shokoverse Revolution</h1>
      <div className="shk__cta-cards">
        <div className="shk__cta-card">
          <FaBuilding className="shk__cta-card-icon" />
          <div className="shk__cta-card-text">
            <h3>Institution</h3>
            <p>Streamline credential issuance with secure, verifiable certificates.</p>
          </div>
          <button className="shk__cta-card-button">Learn More</button>
        </div>
        <div className="shk__cta-card">
          <FaUserGraduate className="shk__cta-card-icon" />
          <div className="shk__cta-card-text">
            <h3>Student</h3>
            <p>Empower learners to showcase their achievements globally.</p>
          </div>
          <button className="shk__cta-card-button">Learn More</button>
        </div>
        <div className="shk__cta-card">
          <FaBinoculars className="shk__cta-card-icon" />
          <div className="shk__cta-card-text">
            <h3>Validator</h3>
            <p>Verify credentials instantly with confidence and ease.</p>
          </div>
          <button className="shk__cta-card-button">Learn More</button>
        </div>
      </div>
    </div>
  </div>
);

export default CTA;