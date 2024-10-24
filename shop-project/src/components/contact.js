import React from 'react';
import './contact.css'; // Import styles for the Contact page

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>If you have any questions, comments, or inquiries, feel free to reach out to us using the information below:</p>

      <div className="contact-info">
        <h2>Our Contact Information</h2>
        <p><strong>Email:</strong> support@shoeshop.com</p>
        <p><strong>Phone:</strong> (555) 123-4567</p>
        <p><strong>Address:</strong> 123 Shoe Street, Footwear City, NY 12345</p>
      </div>

      <div className="contact-form">
        <h2>Send Us a Message</h2>
        <form>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" rows="5" required></textarea>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
