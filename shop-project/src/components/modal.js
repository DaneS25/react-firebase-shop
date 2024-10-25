import React, { useEffect, useState } from 'react';
import { collection, addDoc, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore
import './modal.css'; // Add modal-specific styles

const ProductModal = ({ product, onClose }) => {
  const [sessionId, setSessionId] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null); // Track the selected shoe size
  const [quantity, setQuantity] = useState(1); // Track the selected quantity

  // Sizes from 6 to 14
  const availableSizes = Array.from({ length: 9 }, (_, i) => i + 6); 

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

  // Add to cart function
  const addToCart = async () => {
    if (!selectedSize) {
      alert("Please select a shoe size before adding to the cart.");
      return;
    }

    try {
      const cartRef = collection(db, 'cart'); // Cart collection in Firestore

      // Check if the item already exists in the cart
      const q = query(cartRef, where('sessionId', '==', sessionId), where('productId', '==', product.id), where('size', '==', selectedSize));
      const existingCartItemSnapshot = await getDocs(q);

      if (!existingCartItemSnapshot.empty) {
        // If the product is already in the cart, update the quantity
        const existingCartItem = existingCartItemSnapshot.docs[0];
        const newQuantity = existingCartItem.data().quantity + quantity;

        if (newQuantity > product.stock) {
          alert("You cannot add more items than are in stock.");
          return;
        }

        await updateDoc(doc(db, 'cart', existingCartItem.id), {
          quantity: newQuantity,
        });
      } else {
        // If it's a new product, add it to the cart
        await addDoc(cartRef, {
          sessionId: sessionId,
          productId: product.id,
          name: product.name,
          price: product.price,
          size: selectedSize, // Include selected size
          quantity: quantity,
          imageUrl: product.imageUrl, // Optionally, store the image URL
        });
      }

      alert(`${product.name} (Size ${selectedSize}) has been added to your cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Handle size selection
  const handleSizeSelection = (size) => {
    if (product.sizes.includes(size)) {
      setSelectedSize(size);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
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
        
        <h3>Select Size</h3>
        <div className="size-grid">
          {availableSizes.map((size) => (
            <div
              key={size}
              className={`size-box ${product.sizes.includes(size) ? 'available' : 'unavailable'} ${selectedSize === size ? 'selected' : ''}`}
              onClick={() => handleSizeSelection(size)}
            >
              {size}
            </div>
          ))}
        </div>

        <div className="quantity-control">
          <h3 className='quantity-head'>Quantity</h3>
          <button className="quantity-button" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>
            -
          </button>
          <span className="quantity-display">{quantity}</span>
          <button className="quantity-button" onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= product.stock}>
            +
          </button>
        </div>
        
        <div className='buttons'>
          <button className="close-button" onClick={onClose}>Close</button>
          <button className="add-to-cart-button" onClick={addToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
