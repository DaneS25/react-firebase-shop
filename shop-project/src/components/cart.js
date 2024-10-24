import React from 'react';
import './cart.css'; // Import styles for the Cart page

const Cart = () => {
  // Sample cart data (you can replace this with actual state management or props)
  const cartItems = [
    { id: 1, name: 'Sneakers', price: 79.99, quantity: 2 },
    { id: 2, name: 'Boots', price: 119.99, quantity: 1 },
    { id: 3, name: 'Sandals', price: 49.99, quantity: 3 },
  ];

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
