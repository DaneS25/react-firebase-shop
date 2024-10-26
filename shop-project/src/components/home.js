import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Firebase Firestore functions
import { db } from '../firebase'; // Import Firebase Firestore setup
import './home.css'; // Import styles
import shoeGif from '../Assets/shoegif.gif'; // Import the GIF
import social1 from '../Assets/social-1.png';
import social2 from '../Assets/social-2.png';
import social3 from '../Assets/social-3.png';
import social4 from '../Assets/social-4.png';

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
      }, 2000); // Keep splash for 3 seconds
  
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
          <div className='shop-button-wrapper'>
            <div className="shop-button-container">
              <Link to="/products">
                <button className="shop-button">SHOP NOW</button>
              </Link>
            </div>
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
        <div className="running-shoes-section">
          <h2>Why Choose Runova Running Shoes?</h2>
          <p>At Runova, we understand that every runner has unique needs, whether it's pounding the pavement or hitting the trails. Our shoes are crafted with advanced materials and cutting-edge technology to provide unparalleled support, flexibility, and durability. Each model is rigorously tested by seasoned runners, ensuring you get the best performance in every stride.</p>
          <p>Runova shoes stand out from the crowd because we focus on the details that matter: lightweight design, impact-absorbing soles, and breathable materials. No matter your skill level, our shoes are engineered to boost your performance while providing comfort that lasts. Experience the difference with Runova, where quality meets innovation in every step.</p>
        </div>
        {/* Socials Section */}
        <div className="socials-section">
          <h2>Follow us on all socials</h2>
          <div className="socials-icons">
            <img src={social1} alt="Facebook" className="social-icon" />
            <img src={social2} alt="Twitter" className="social-icon" />
            <img src={social3} alt="Instagram" className="social-icon" />
            <img src={social4} alt="LinkedIn" className="social-icon" />
          </div>
        </div>
    </div>
  );
};

export default Home;
