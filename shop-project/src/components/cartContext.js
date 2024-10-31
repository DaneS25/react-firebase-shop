// cartContext.js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = (item) => {
    // Check if item with the same product ID and size already exists
    const existingItemIndex = cartItems.findIndex(
      (cartItem) => cartItem.productId === item.productId && cartItem.size === item.size
    );

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += item.quantity;
      setCartItems(updatedItems);
    } else {
      // Add new item
      setCartItems([...cartItems, item]);
    }
  };

  const removeFromCart = (productId, size) => {
    setCartItems(cartItems.filter((item) => !(item.productId === productId && item.size === size)));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
