import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Firebase setup
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore'; // Firestore functions
import { useNavigate } from 'react-router-dom';
import './adminPanel.css'; // Import styles

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null); // To check if the user is admin
  const [productData, setProductData] = useState({
    name: '',
    type: '',
    description: '',
    gender: '',
    waterproof: false,
    price: '',
    stock: '',
    sizes: [],
    featured: false,
    imageUrl: '',
  }); // State to handle product form data
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().isAdmin);
        } else {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false); // Explicitly set to false if user is not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      if (isAdmin === false) {
        navigate('/'); // Redirect to home if not an admin
      }
    }
  }, [user, isAdmin, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleSizesChange = (e) => {
    const sizes = e.target.value.split(',').map((size) => Number(size.trim()));
    setProductData({
      ...productData,
      sizes,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productCollection = collection(db, 'products');
      await addDoc(productCollection, {
        ...productData,
        price: Number(productData.price), // Ensure price is saved as a number
        stock: Number(productData.stock), // Ensure stock is saved as a number
        featured: Boolean(productData.featured), // Ensure featured is boolean
      });

      alert('Product added successfully!');
      setProductData({
        name: '',
        type: '',
        description: '',
        gender: '',
        waterproof: false,
        price: '',
        stock: '',
        sizes: [],
        featured: false,
        imageUrl: '',
      }); // Clear the form
    } catch (error) {
      console.error('Error adding product: ', error);
    }
  };

  if (isAdmin === null) {
    return <div>Loading...</div>; // Loading state
  }

  if (!user) {
    return <div>Please log in to access the admin panel.</div>;
  }

  return (
    <div className="admin-panel-container">
      <h1>Admin Panel</h1>
      <h2>Add a New Product</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Change from text input to dropdown for Type */}
        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={productData.type}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Type</option>
            <option value="road">Road</option>
            <option value="trail">Trail</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={productData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="mens">Mens</option>
            <option value="womens">Womens</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="featured">Waterproof:</label>
          <input
            type="checkbox"
            id="waterproof"
            name="waterproof"
            checked={productData.waterproof}
            onChange={(e) =>
              setProductData({ ...productData, waterproof: e.target.checked })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={productData.stock}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sizes">Sizes (comma-separated):</label>
          <input
            type="text"
            id="sizes"
            name="sizes"
            value={productData.sizes.join(', ')}
            onChange={handleSizesChange}
            placeholder="e.g. 7, 8, 9, 10"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="featured">Featured:</label>
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={productData.featured}
            onChange={(e) =>
              setProductData({ ...productData, featured: e.target.checked })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={productData.imageUrl}
            onChange={handleInputChange}
            required
          />
        </div>

        <button className="submit-button" type="submit">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
