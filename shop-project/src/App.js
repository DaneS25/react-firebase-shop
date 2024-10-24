import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/navBar'; // Import NavBar
import Home from './components/home';
import ProductList from './components/productList'; // Assuming this is your product page
import About from './components/about'; // Import About component
import Contact from './components/contact'; // Import other components as needed
import Cart from './components/cart'; // Import other components as needed
import Login from './login';
import Register from './register';
import AdminPanel from './components/adminPanel'; // Import AdminPanel component

function App() {
  return (
    <Router>
      {/* Render NavBar once so it appears on all pages */}
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
