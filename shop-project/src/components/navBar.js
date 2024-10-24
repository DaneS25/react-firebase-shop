import React from 'react';
import { Link } from 'react-router-dom';
import './navBar.css'; // Add custom styles

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item"><Link to="/">Home</Link></li>
        <div className="nav-right">
          <li className="nav-item"><Link to="/products">Products</Link></li>
          <li className="nav-item"><Link to="/about">About</Link></li>
          <li className="nav-item"><Link to="/contact">Contact</Link></li>
          <li className="nav-item"><Link to="/cart">Cart</Link></li>
        </div>
      </ul>
    </nav>
  );
};

export default NavBar;
