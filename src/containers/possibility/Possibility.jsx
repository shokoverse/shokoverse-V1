import React from 'react';
import { FaBinoculars, FaUserGraduate, FaBuilding } from 'react-icons/fa';
import './possibility.css';

const Possibility = () => (
  <section className="shk__possibility section__padding" id='credentials'>
    <h2 className="shk__possibility-title gradient__text">The World of Credentials and Trust</h2>
    <div className="shk__possibility-content">
      {/* BEFORE SHOKOVERSE */}
      <div className="shk__possibility-before">
        <h3 className="shk__possibility-subtitle">Without Shokoverse</h3>
        <details className="shk__possibility-details">
          <summary className="shk__possibility-summary">
            <FaBuilding className="shk__possibility-icon" /> Institutions
          </summary>
          <ul className="shk__possibility-list">
            <li>Credential fraud risk and reputational damage</li>
            <li>Cumbersome issuance and verification workflows</li>
            <li>Limited visibility into credential impact</li>
          </ul>
        </details>
        <details className="shk__possibility-details">
          <summary className="shk__possibility-summary">
            <FaUserGraduate className="shk__possibility-icon" /> Students
          </summary>
          <ul className="shk__possibility-list">
            <li>Lost or damaged certificates meant lost opportunities</li>
            <li>Difficulty proving achievements across borders</li>
            <li>Lack of recognition for non-traditional education paths</li>
          </ul>
        </details>
        <details className="shk__possibility-details">
          <summary className="shk__possibility-summary">
            <FaBinoculars className="shk__possibility-icon" /> Validators
          </summary>
          <ul className="shk__possibility-list">
            <li>Slow and unreliable verification processes</li>
            <li>Exposure to fake or misrepresented qualifications</li>
            <li>No standardized system for credential evaluation</li>
          </ul>
        </details>
      </div>

      {/* AFTER SHOKOVERSE */}
      <div className="shk__possibility-after">
        <h3 className="shk__possibility-subtitle">With Shokoverse</h3>
        <details className="shk__possibility-details">
          <summary className="shk__possibility-summary">
            <FaBuilding className="shk__possibility-icon" /> Institutions
          </summary>
          <ul className="shk__possibility-list">
            <li>Issue secure credentials that reinforce institutional trust</li>
            <li>Automate issuance and streamline verification</li>
            <li>Track credential impact and global reach</li>
          </ul>
        </details>
        <details className="shk__possibility-details">
          <summary className="shk__possibility-summary">
            <FaUserGraduate className="shk__possibility-icon" /> Students
          </summary>
          <ul className="shk__possibility-list">
            <li>Own and access certificates anytime, anywhere</li>
            <li>Prove achievements across borders with confidence</li>
            <li>Gain credibility for every learning journey</li>
          </ul>
        </details>
        <details className="shk__possibility-details">
          <summary className="shk__possibility-summary">
            <FaBinoculars className="shk__possibility-icon" /> Validators
          </summary>
          <ul className="shk__possibility-list">
            <li>Verify instantly, securely and at scale</li>
            <li>Trust that every certificate is authentic</li>
            <li>Standardize how qualifications are evaluated</li>
          </ul>
        </details>
      </div>
    </div>
  </section>
);

export default Possibility;