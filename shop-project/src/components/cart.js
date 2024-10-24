import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firestore
import './cart.css'; // Import styles for the Cart page

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const sessionId = localStorage.getItem('sessionId'); // Get the sessionId from localStorage

  // Fetch cart items for the current session
  useEffect(() => {
    const fetchCartItems = async () => {
      const cartRef = collection(db, 'cart');
      const q = query(cartRef, where('sessionId', '==', sessionId)); // Query the cart items for this session
      const cartSnapshot = await getDocs(q);
      const cartList = cartSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(cartList);
    };

    if (sessionId) {
      fetchCartItems();
    }
  }, [sessionId]);

  // Function to remove an item from the cart
  const removeFromCart = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'cart', itemId)); // Delete the item from Firestore
      setCartItems(cartItems.filter((item) => item.id !== itemId)); // Update local cart state
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Calculate the total price of the cart items
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. Start shopping now!</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <h2>{item.name}</h2>
              <p>Price: ${item.price.toFixed(2)}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
              <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="cart-total">
          <h2>Total: ${getTotalPrice()}</h2>
          <button className="checkout-button">Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
