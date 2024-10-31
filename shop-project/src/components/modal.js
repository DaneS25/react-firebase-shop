import React, { useEffect, useState } from 'react';
import { useCart } from './cartContext'; // Import useCart to access cart context
import './modal.css';

const ProductModal = ({ product, onClose, isAdmin }) => {
  const [editableProduct, setEditableProduct] = useState(product);
  const [sessionId, setSessionId] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart(); // Destructure addToCart from context

  // Initialize session ID
  useEffect(() => {
    const session = localStorage.getItem('sessionId');
    if (!session) {
      const newSessionId = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', newSessionId);
      setSessionId(newSessionId);
    } else {
      setSessionId(session);
    }
  }, []);

  useEffect(() => {
    setEditableProduct(product);
  }, [product]);

  // Add to cart functionality
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a shoe size before adding to the cart.");
      return;
    }

    // Add item to cart using the cart context
    addToCart({
      productId: product.id,
      sessionId,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      imageUrl: product.imageUrl,
    });

    alert(`${product.name} (Size ${selectedSize}) has been added to your cart!`);
  };

  // Size and quantity selection
  const handleSizeSelection = (size) => {
    if (product.sizes.includes(size)) {
      setSelectedSize(size);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{editableProduct.name}</h2>
        <img src={editableProduct.imageUrl} alt={editableProduct.name} className="modal-product-image" />

        {/* Regular User View */}
        <p><strong>Price:</strong> ${editableProduct.price}</p>
        <p><strong>Stock:</strong> {editableProduct.stock}</p>
        <p><strong>Description:</strong> {editableProduct.description}</p>

        <h3>Select Size</h3>
        <div className='size-container'>
          <div className="size-grid">
            {Array.from({ length: 12 }, (_, i) => i + 5).map((size) => (
              <div
                key={size}
                className={`size-box ${product.sizes.includes(size) ? 'available' : 'unavailable'} ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => handleSizeSelection(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <div className="quantity-control">
          <h3 className="quantity-head">Quantity</h3>
          <button className="quantity-button" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>-</button>
          <span className="quantity-display">{quantity}</span>
          <button className="quantity-button" onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= product.stock}>+</button>
        </div>

        <div className="buttons">
          <button className="close-button" onClick={onClose}>Close</button>
          <button className="add-to-cart-button" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
