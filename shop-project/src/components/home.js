import React from 'react';
import { Link } from 'react-router-dom';
import './home.css'; // Import styles

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-grid">
        {/* Left Section: Logo and Shop Button */}
        <div className="home-left">
          <img src="/path-to-your-logo/logo.png" alt="Shop Logo" className="shop-logo" />
          <Link to="/products">
            <button className="shop-button">SHOP</button>
          </Link>
        </div>
        
        {/* Right Section: Image */}
        <div className="home-right">
          <img src="/path-to-your-image/featured-image.jpg" alt="Featured" className="featured-image" />
        </div>
      </div>

      {/* Additional Grid Sections for Future Content */}
      <div className="home-content-grid">
        <div className="content-section">Section 1</div>
        <div className="content-section">Section 2</div>
        <div className="content-section">Section 3</div>
        {/* Add more sections as needed */}
      </div>
    </div>
  );
};

export default Home;
