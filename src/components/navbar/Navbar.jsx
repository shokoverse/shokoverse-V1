import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './navbar.css';

const Menu = () => {
  return (
    <>
      <p>
        <a href="#home">Home</a>
      </p>
      <p>
        <a href="#wshk">About</a>
      </p>
      <p>
        <a href="#credentials">Credentials & trust</a>
      </p>
    </>
  );
};

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className="shk__navbar">
      <div className="shk__navbar-links">
        <div className="shk__navbar-links_logo">
          <img src="/images/shokoverse logo (1).png" alt="logo" />
        </div>
        <div className="shk__navbar-links_container">
          <Menu />
        </div>
      </div>
      <div className="shk__navbar-sign">
        <Link to="/getstarted">
          <button type="button">Get started</button>
        </Link>
      </div>

      <div className="shk__navbar-menu">
        {toggleMenu ? (
          <RiCloseLine
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <RiMenu3Line
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <div className="shk__navbar-menu_container scale-up-center">
            <div className="shk__navbar-menu_container-links">
              <Menu />
            </div>
            <div className="shk__navbar-menu_container-links-sign">
              <Link to="/getstarted">
                <button type="button">Get started</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;