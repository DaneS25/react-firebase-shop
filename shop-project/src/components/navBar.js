import React from 'react';
import { Link } from 'react-router-dom';
import './navBar.css'; // Add custom styles

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;
