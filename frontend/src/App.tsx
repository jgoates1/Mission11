import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext'; 
import CartSummary from './components/CartSummary';
import BooksPage from './pages/BooksPage';
import CartPage from './pages/CartPage';
import './App.css'; // Optional, especially since we deleted its contents earlier!

function App() {
  return (
    <CartProvider>
      <Router>
        {/* CartSummary stays here so it floats on top of EVERY page */}
        <CartSummary />
        
        <Routes>
          {/* Now we just route directly to our full page components! */}
          <Route path="/" element={<BooksPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;