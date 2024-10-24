import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Your Firebase setup
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null); // Change initial value to null to differentiate loading
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

  // Redirect if not an admin
  useEffect(() => {
    if (user) {
      if (isAdmin === false) {
        navigate('/'); // Redirect to home if not an admin
      }
    }
  }, [user, isAdmin, navigate]);

  // Loading state check
  if (isAdmin === null) {
    return <div>Loading...</div>; // Wait until user admin status is determined
  }

  if (!user) {
    return <div>Please log in to access the admin panel.</div>;
  }

  // Render admin panel content
  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Your admin functionalities such as adding products */}
    </div>
  );
};

export default AdminPanel;
