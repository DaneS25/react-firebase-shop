import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import './checkout.css';
import { useCart } from './cartContext';

const stripePromise = loadStripe('pk_test_51QFtbzDtXC0dl6OIqVNB3YCoOxh15lwhbWhbRmTJybDvJxwn6vApESR9SXNMtlVb0Md9DiDpSjcTx3Sz3j7Xi5qh00Lucz3K4h');

const Checkout = () => {
  const { cartItems, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const stripe = await stripePromise;
    
    // Create a new checkout session using your server endpoint
    const response = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cartItems }),
      });
    
    const session = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({ sessionId: session.id });

    if (result.error) {
      console.error(result.error.message);
    }

    setLoading(false);
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-items">
        {cartItems.map((item) => (
          <div key={item.id} className="checkout-item">
            <div className="checkout-item-details">
              <h2>{item.name}</h2>
              <p>Price: ${item.price.toFixed(2)}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Size: {item.size}</p>
              <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <img src={item.imageUrl} alt={item.name} className="checkout-item-image" />
          </div>
        ))}
      </div>
      <div className="checkout-total">
        <h2>Total: ${getTotalPrice()}</h2>
        <button
          className="checkout-button"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
