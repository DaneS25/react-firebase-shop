import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import ProductModal from './modal';
import './productList.css';
import shoeGif from '../Assets/shoegif.gif'; // Import the GIF

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      const productCollection = collection(db, 'products');

      // Get query parameter from the URL (e.g., category=mens)
      const searchParams = new URLSearchParams(location.search);
      const category = searchParams.get('category');

      let productQuery;
      if (category && category !== 'all') {
        productQuery = query(productCollection, where('type', '==', category));
      } else {
        productQuery = productCollection; // No filter or "All" category
      }

      const productSnapshot = await getDocs(productQuery);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);

      // Force the splash to stay for 1 second after fetching
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 2000); // Adjust time as needed (currently 1 second)

      return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout
    };

    fetchProducts();

    // Check if a product is passed via location.state from Home page
    if (location.state && location.state.selectedProduct) {
      setSelectedProduct(location.state.selectedProduct); // Automatically open the modal
    }
  }, [location.search, location.state]);

  const openModal = (product) => {
    setSelectedProduct(product); // Open the modal when a product is clicked
  };

  const closeModal = () => {
    setSelectedProduct(null); // Close the modal
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
    <div className="product-list-container">
      <h1 className="product-list-header">Product List</h1>
      {products.length === 0 && <p>No products available.</p>}
      <div className="products-grid">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => openModal(product)}
          >
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <h2>{product.name}</h2>
            <p>${product.price}</p>
          </div>
        ))}
      </div>

      {/* Render the modal only if a product is selected */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={closeModal} />}
    </div>
  );
};

export default ProductList;
