import React, { useEffect, useState } from 'react';
import { collection, addDoc, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore
import './modal.css'; // Add modal-specific styles

const ProductModal = ({ product, onClose }) => {
  const [sessionId, setSessionId] = useState(null);

  // Generate a random session ID for anonymous users
  useEffect(() => {
    const session = localStorage.getItem('sessionId');
    if (!session) {
      const newSessionId = Math.random().toString(36).substr(2, 9); // Generate a random session ID
      localStorage.setItem('sessionId', newSessionId);
      setSessionId(newSessionId);
    } else {
      setSessionId(session);
    }
  }, []);

  const addToCart = async () => {
    try {
      const cartRef = collection(db, 'cart'); // Cart collection in Firestore

      // Check if the item already exists in the cart
      const q = query(cartRef, where('sessionId', '==', sessionId), where('productId', '==', product.id));
      const existingCartItemSnapshot = await getDocs(q);

      if (!existingCartItemSnapshot.empty) {
        // If the product is already in the cart, update the quantity
        const existingCartItem = existingCartItemSnapshot.docs[0];
        await updateDoc(doc(db, 'cart', existingCartItem.id), {
          quantity: existingCartItem.data().quantity + 1,
        });
      } else {
        // If it's a new product, add it to the cart
        await addDoc(cartRef, {
          sessionId: sessionId,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl, // Optionally, store the image URL
        });
      }

      alert(`${product.name} has been added to your cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (!product) return null; // If no product is passed, don't render anything

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent closing on modal click */}
        <h2>{product.name}</h2>
        <img src={product.imageUrl} alt={product.name} className="modal-product-image" />
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Sizes Available:</strong> {product.sizes.join(', ')}</p>
        <button className="close-button" onClick={onClose}>Close</button>
        <button className="add-to-cart-button" onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductModal;
