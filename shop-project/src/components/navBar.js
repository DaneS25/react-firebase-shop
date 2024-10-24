import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase'; // Import Firebase authentication and Firestore
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import './navBar.css'; // Import styles

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch the user's username and admin status from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
          setIsAdmin(userDoc.data().isAdmin); // Get admin status
        }
      } else {
        setUsername('');
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Navigate to home after logout
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <nav className="navbar">
      <ul className="nav-left">
        <li><Link to="/">Home</Link></li>
      </ul>
      <ul className="nav-right">
        {user && username && <li>Welcome, {username}</li>} {/* Display welcome message */}
        {isAdmin && <li><Link to="/admin">Admin Panel</Link></li>} {/* Only show if admin */}
        <li><Link to="/products">Shop</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        {user ? (
          <li>
            <button onClick={handleLogout} className="auth-button">Logout</button>
          </li>
        ) : (
          <li><Link to="/login" className="auth-button">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
