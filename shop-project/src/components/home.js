import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Firebase Firestore functions
import { db } from '../firebase'; // Import Firebase Firestore setup
import './home.css'; // Import styles
import shoeGif from '../Assets/shoegif.gif'; // Import the GIF

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Fetch featured products from Firestore
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('featured', '==', true)); // Only get featured products
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeaturedProducts(products);
      setLoading(true); // Set loading to false after fetching data

      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 1000); // Keep splash for 3 seconds
  
      return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout
    };

    fetchFeaturedProducts();
  }, []);

  // Function to handle clicking a featured product
  const handleProductClick = (product) => {
    navigate('/products', { state: { selectedProduct: product } }); // Pass the product data to ProductList page
  };

  if (loading) {
    // Render loading splash with GIF
    return (
      <div className="loading-splash">
        <img src={shoeGif} alt="Loading..." className="loading-gif" />
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-grid">
        {/* Left Section: Logo, Promotional Text, and Shop Button */}
        <div className="home-left">
          <img src="https://firebasestorage.googleapis.com/v0/b/shop-project-4b475.appspot.com/o/Runova-logo.jpg?alt=media&token=f4e29a69-d879-45fc-9c3a-21fc47c42b07" alt="Shop Logo" className="shop-logo" />
          
          {/* Promotional Text */}
          <div className="promo-text">
            <h1>Step into Your Best Run</h1>
            <p>Discover the ultimate in running performance. Shop the latest footwear engineered for speed and comfort.</p>
          </div>

          {/* Shop Button Container */}
          <div className="shop-button-container">
            <Link to="/products">
              <button className="shop-button">SHOP NOW</button>
            </Link>
          </div>
        </div>
        
        {/* Right Section: Image */}
        <div className="home-right">
          <img src="https://firebasestorage.googleapis.com/v0/b/shop-project-4b475.appspot.com/o/Running%20person.jpg?alt=media&token=f7bcfdde-3a44-4bba-9b8b-e1bf847d0ec5" alt="Featured" className="featured-image" />
        </div>
      </div>

      {/* Featured Products Grid */}
      <div className="home-content-grid">
        {featuredProducts.length === 0 ? (
          <p>No featured products available</p>
        ) : (
          featuredProducts.map((product) => (
            <div key={product.id} className="content-section" onClick={() => handleProductClick(product)}>
              <img src={product.imageUrl} alt={product.name} className="featured-product-image" />
              <h2>{product.name}</h2>
              <p>${product.price}</p>
              <button className='view-button'>View Product</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
