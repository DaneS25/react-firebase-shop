import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './navBar.css';

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null); // Track scroll direction
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
          setIsAdmin(userDoc.data().isAdmin);
        }
      } else {
        setUsername('');
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Detect scroll and set direction
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setScrollDirection('down'); // User is scrolling down
      } else if (window.scrollY < lastScrollY) {
        setScrollDirection('up'); // User is scrolling up
      }
      setLastScrollY(window.scrollY); // Update the last Y position
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <nav className="navbar">
      <ul className="nav-left">
        {/* Only the image is wrapped in the link */}
        <li>
          <Link to="/">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/shop-project-4b475.appspot.com/o/Runova-logo.jpg?alt=media&token=f4e29a69-d879-45fc-9c3a-21fc47c42b07" // Replace with your image path
              alt="Home"
               className={`home-icon ${
                scrollDirection === 'down' ? 'spin-forward' : scrollDirection === 'up' ? 'spin-backward' : ''
              }`}
            />
          </Link>
        </li>
      </ul>
      <ul className="nav-right">
        {user && username && <li className='welcome'>Welcome, {username}</li>}
        {isAdmin && <li><Link to="/admin">Admin Panel</Link></li>}
        <li
          className="dropdown"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <span className='dropdown-shop'>Shop</span>
          {showDropdown && (
            <ul className="dropdown-menu">
              <li onClick={() => handleCategoryClick('mens')}>Mens</li>
              <li onClick={() => handleCategoryClick('womens')}>Womens</li>
              <li onClick={() => handleCategoryClick('all')}>All</li>
            </ul>
          )}
        </li>
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
