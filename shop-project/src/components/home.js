import React from 'react';
import { Link } from 'react-router-dom';
import './home.css'; // Import styles

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-grid">
        {/* Left Section: Logo and Shop Button */}
        <div className="home-left">
            <img src="https://firebasestorage.googleapis.com/v0/b/shop-project-4b475.appspot.com/o/shubham-mittal-sCXmwaVrBio-unsplash.jpg?alt=media&token=65e23a3a-9022-49e8-83d6-90a6e6cdcd3a" alt="Shop Logo" className="shop-logo" />
          {/* Shop Button Container */}
          <div className="shop-button-container">
            <Link to="/products">
              <button className="shop-button">SHOP</button>
            </Link>
          </div>
        </div>
        
        {/* Right Section: Image */}
        <div className="home-right">
          <img src="https://firebasestorage.googleapis.com/v0/b/shop-project-4b475.appspot.com/o/imani-bahati-LxVxPA1LOVM-unsplash.jpg?alt=media" alt="Featured" className="featured-image" />
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
