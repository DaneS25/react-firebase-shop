import React, { useEffect, useState, useCallback, useContext } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useLocation } from 'react-router-dom';
import ProductModal from './modal';
import FilterMenu from './filterMenu';
import './productList.css';
import shoeGif from '../Assets/shoegif.gif';
import { AuthContext } from './authContext';

const ProductList = () => {
  const { isAdmin } = useContext(AuthContext); // Ensure isAdmin is accessed from AuthContext
  console.log("isAdmin in ProductList:", isAdmin); // Debug line for checking isAdmin

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

  const location = useLocation();

  useEffect(() => {
    // Check if there's a category parameter in the URL
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');

    // Update the filter state based on the category
    if (category) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        mens: category === 'mens',
        womens: category === 'womens',
      }));
    }
  }, [location.search]);

  useEffect(() => {
    if (location.state && location.state.selectedProduct) {
      setSelectedProduct(location.state.selectedProduct);
    }
  }, [location.state]);

  const fetchProducts = useCallback(async () => {
    const productCollection = collection(db, 'products');
    const conditions = [];
    if (filters.mens) conditions.push(where('gender', '==', 'mens'));
    if (filters.womens) conditions.push(where('gender', '==', 'womens'));
    if (filters.roadRunning) conditions.push(where('type', '==', 'road'));
    if (filters.trailRunning) conditions.push(where('type', '==', 'trail'));
    if (filters.waterproof) conditions.push(where('waterproof', '==', true));
  
    let productQuery = productCollection;
    if (conditions.length) productQuery = query(productQuery, ...conditions);
    if (filters.price === 'lowToHigh') productQuery = query(productQuery, orderBy('price', 'asc'));
    else if (filters.price === 'highToLow') productQuery = query(productQuery, orderBy('price', 'desc'));
  
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
    fetchProducts();
  }, [fetchProducts]);

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
        <h1 className="product-list-header">Runova Shoes</h1>
        {products.length === 0 && <p>No products available.</p>}
        <div className="products-grid">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => openModal(product)}
            >
              <img src={product.imageUrl} alt={product.name} className="product-image" />
              <div className='product-info'>
                <h2>{product.name}</h2>
                <p>${product.price}</p>
              </div>
            </div>
          ))}
        </div>
        {selectedProduct && <ProductModal product={selectedProduct} onClose={closeModal} isAdmin={isAdmin} />}
      </div>
    </div>
  );
};

export default ProductList;
