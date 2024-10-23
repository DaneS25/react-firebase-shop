import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/navBar'; // Import NavBar
import Home from './components/home';
import ProductList from './components/productList'; // Assuming this is your product page

function App() {
  return (
    <Router>
      {/* Render NavBar once so it appears on all pages */}
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
      </Routes>
    </Router>
  );
}

export default App;
