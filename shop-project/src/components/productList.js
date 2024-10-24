import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // import Firestore
import ProductModal from './modal'; // Import the modal component
import './productList.css'; // Import styles

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // State for the selected product

  useEffect(() => {
    const fetchProducts = async () => {
      const productCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    };
    fetchProducts();
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product); // Set the selected product to be shown in the modal
  };

  const closeModal = () => {
    setSelectedProduct(null); // Close the modal by clearing the selected product
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
            onClick={() => openModal(product)} // Make the product clickable
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
