import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'; // Import necessary Firestore functions
import { db } from '../firebase';
import ProductModal from './modal';
import FilterMenu from './filterMenu'; // Import the filter component
import './productList.css';
import shoeGif from '../Assets/shoegif.gif'; // Import the GIF

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    price: '',
    mens: false,
    womens: false,
    roadRunning: false,
    trailRunning: false,
    waterproof: false,
  });

  // Function to fetch products based on filters
  const fetchProducts = useCallback(async () => {
    const productCollection = collection(db, 'products');
    
    // Create an array to hold query conditions
    const conditions = [];
  
    // Add gender filters
    if (filters.mens) {
      conditions.push(where('gender', '==', 'mens'));
    }
    if (filters.womens) {
      conditions.push(where('gender', '==', 'womens'));
    }
  
    // Add type filters
    if (filters.roadRunning) {
      conditions.push(where('type', '==', 'road'));
    }
    if (filters.trailRunning) {
      conditions.push(where('type', '==', 'trail'));
    }
  
    // Add waterproof filter
    if (filters.waterproof) {
      conditions.push(where('waterproof', '==', true));
    }
  
    // Start with the base query
    let productQuery = productCollection;
  
    // Combine all conditions
    if (conditions.length) {
      productQuery = query(productQuery, ...conditions);
    }
  
    // Apply orderBy for price after conditions
    if (filters.price === 'lowToHigh') {
      productQuery = query(productQuery, orderBy('price', 'asc'));
    } else if (filters.price === 'highToLow') {
      productQuery = query(productQuery, orderBy('price', 'desc'));
    }
  
    console.log("Final Product Query:", productQuery);
  
    try {
      const productSnapshot = await getDocs(productQuery);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setProducts(productList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts(); // Fetch products when the component mounts
  }, [fetchProducts]); // Include fetchProducts in dependencies

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="loading-splash">
        <img src={shoeGif} alt="Loading..." className="loading-gif" />
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="filter-area">
        <FilterMenu filters={filters} setFilters={setFilters} />
      </div>
      <div className="products-area">
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
        {selectedProduct && <ProductModal product={selectedProduct} onClose={closeModal} />}
      </div>
    </div>
  );
};

export default ProductList;
