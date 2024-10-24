import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import ProductModal from './modal';
import './productList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
    };

    fetchProducts();
  }, [location.search]);

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

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

      {selectedProduct && <ProductModal product={selectedProduct} onClose={closeModal} />}
    </div>
  );
};

export default ProductList;
