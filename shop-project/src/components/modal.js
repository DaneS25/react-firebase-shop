import React, { useEffect, useState } from 'react';
import { collection, addDoc, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import './modal.css';

const ProductModal = ({ product, onClose, isAdmin }) => {
  const [editableProduct, setEditableProduct] = useState(product);
  const [sessionId, setSessionId] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  // Update editableProduct state when product prop changes
  useEffect(() => {
    setEditableProduct(product);
  }, [product]);

  useEffect(() => {
    console.log("isAdmin in ProductModal:", isAdmin); // Debugging line
  }, [isAdmin]);

  // Update Firestore with edited product details
  const handleSave = async () => {
    try {
      const productDoc = doc(db, 'products', product.id);
      await updateDoc(productDoc, {
        ...editableProduct,
        price: Number(editableProduct.price),
        stock: Number(editableProduct.stock),
      });
      alert('Product updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Add to cart functionality
  const addToCart = async () => {
    if (!selectedSize) {
      alert("Please select a shoe size before adding to the cart.");
      return;
    }

    try {
      const cartRef = collection(db, 'cart');
      const q = query(cartRef, where('sessionId', '==', sessionId), where('productId', '==', product.id), where('size', '==', selectedSize));
      const existingCartItemSnapshot = await getDocs(q);

      if (!existingCartItemSnapshot.empty) {
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
        await addDoc(cartRef, {
          sessionId,
          productId: product.id,
          name: product.name,
          price: product.price,
          size: selectedSize,
          quantity,
          imageUrl: product.imageUrl,
        });
      }

      alert(`${product.name} (Size ${selectedSize}) has been added to your cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Handle input change for admin editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableProduct({ ...editableProduct, [name]: value });
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

        {/* Admin Edit View */}
        {isAdmin ? (
          <div className="admin-edit-form">
            <h3>Edit Product</h3>
            <label>Product Name:
              <input
                type="text"
                name="name"
                value={editableProduct.name}
                onChange={handleInputChange}
              />
            </label>
            <label>Price:
              <input
                type="number"
                name="price"
                value={editableProduct.price}
                onChange={handleInputChange}
              />
            </label>
            <label>Stock:
              <input
                type="number"
                name="stock"
                value={editableProduct.stock}
                onChange={handleInputChange}
              />
            </label>
            <label>Description:
              <textarea
                name="description"
                value={editableProduct.description}
                onChange={handleInputChange}
              />
            </label>
            <label>Image URL:
              <input
                type="text"
                name="imageUrl"
                value={editableProduct.imageUrl}
                onChange={handleInputChange}
              />
            </label>
            <button onClick={handleSave}>Save Changes</button>
          </div>
        ) : (
          <>
            {/* Regular User View */}
            <p><strong>Price:</strong> ${editableProduct.price}</p>
            <p><strong>Stock:</strong> {editableProduct.stock}</p>
            <p><strong>Description:</strong> {editableProduct.description}</p>

            <h3>Select Size</h3>
            <div className="size-grid">
              {Array.from({ length: 9 }, (_, i) => i + 6).map((size) => (
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
              <h3 className="quantity-head">Quantity</h3>
              <button className="quantity-button" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>-</button>
              <span className="quantity-display">{quantity}</span>
              <button className="quantity-button" onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= product.stock}>+</button>
            </div>

            <div className="buttons">
              <button className="close-button" onClick={onClose}>Close</button>
              <button className="add-to-cart-button" onClick={addToCart}>Add to Cart</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
