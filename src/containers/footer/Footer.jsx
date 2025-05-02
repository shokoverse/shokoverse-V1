import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa"; // Importing icons
import "./footer.css";

const Footer = () => {
  return (
    <div className="shk__footer section__padding">
      <div className="shk__footer-links">
        <div className="shk__footer-links_logo">
          <img src="/logo.png" alt="" className="w-[240px]" />
          <h3 className="mt-3.5">Where Achievements live forever.</h3>
        </div>
        <div className="shk__footer-links_div">
          <h4>Useful Links</h4>
          <p>Content</p>
          <p>How it Works</p>
          <p>Create</p>
          <p>Explore</p>
          <p>Terms & Services</p>
        </div>
        <div className="shk__footer-links_div">
          <h4>Community</h4>
          <p>Help Center</p>
          <p>Partners</p>
          <p>Suggestions</p>
          <p>Blog</p>
          <p>Newsletters</p>
        </div>
        <div className="shk__footer-links_div">
          <h4>Follow Us</h4>
          <div className="shk__footer-socials">
            <a href="https://x.com/Shokoverse_HQ" target="_blank"><FaTwitter className="shk__footer-social_icon" /></a>
            <FaFacebookF className="shk__footer-social_icon" />
            <FaInstagram className="shk__footer-social_icon" />
          </div>
        </div>
      </div>
      <div className="shk__footer-copyright">
        <p>© 2025 ShokoVerse. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;