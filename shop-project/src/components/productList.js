import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // import Firestore
import './productList.css'; // Import the new styles

const ProductList = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <div className="product-list-container"> {/* Apply grid container class */}
      <h1 className="product-list-header">Product List</h1> {/* Added a specific class for styling */}
      {products.length === 0 && <p>No products available.</p>}
      <div className="products-grid"> {/* Wrap products in a separate div */}
        {products.map((product) => (
          <div key={product.id} className="product-card"> {/* Apply card class */}
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <h2>{product.name}</h2>
            <p>${product.price}</p>
            <p>In Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
