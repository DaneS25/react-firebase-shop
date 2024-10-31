import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import { useCart } from './cartContext'; // Import useCart from context
import './cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, getTotalPrice } = useCart(); // Use cart values from context

  const handleCheckoutClick = () => {
    navigate('/checkout'); // Navigate to checkout page
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
              <div className="cart-item-details">
                <h2>{item.name}</h2>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Size: {item.size}</p>
                <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.productId, item.size)}
                >
                  Remove
                </button>
              </div>
              <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
            </div>
          ))}
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="cart-total">
          <h2>Total: ${getTotalPrice()}</h2>
          <button className="checkout-button" onClick={handleCheckoutClick}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
