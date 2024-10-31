import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/navBar';
import Home from './components/home';
import ProductList from './components/productList';
import About from './components/about';
import Contact from './components/contact';
import Cart from './components/cart';
import Login from './login';
import Register from './register';
import AdminPanel from './components/adminPanel';
import Checkout from './components/checkout';
import { CartProvider } from './components/cartContext';
import { AuthProvider } from './components/authContext'; // Import AuthProvider

function App() {
  return (
    <AuthProvider> {/* Wrap Router with AuthProvider */}
      <CartProvider>
        <Router>
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
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
