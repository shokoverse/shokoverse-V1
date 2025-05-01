import React from 'react';
import Feature from '../../components/feature/Feature';
import "./whatSHK.css";

const WhatSHK = () => (
  <div className="shk__whatshk section__margin" id="wshk">
    <div className="shk__whatshk-feature">
      <Feature title="What is SHOKOVERSE"  />
    </div>
    <div className="shk__whatshk-heading">
      <h1 className="gradient__text">The possibilities are beyond your imagination</h1>
      <p>Explore the Library</p>
    </div>
    <div className="shk__whatshk-container">
      <Feature title="Revolutionizes" text="Shokoverse transforms traditional certification by leveraging blockchain technology to elevate credibility, modernize credential processes and connect all participants in the evolving landscape of global recognition." />
      <Feature title="Empowerment" text="Education providers, bootcamps, and organizations can issue secure, instantly verifiable certificates that strengthen their reputation for trust, innovation, and academic excellence. Recipients gain ownership of their achievements through a trusted, shareable digital format that not only proves their skills but celebrates their journey. Employers, academic institutions, and other stakeholders can verify credentials instantly and reliably—without relying on third-party intermediaries." />
      <Feature title="Education" text="At jointure ladyship an insisted so humanity he. Friendly bachelor entrance to on by. As put impossible own apartments b" />
    </div>
  </div>
);

export default WhatSHK;