import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

const CartSummary = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <div style={{ position: 'fixed', top: '20px', right: '30px', zIndex: 1000 }}>
      {/* We added position-relative to the button so the absolute badge sticks to it! */}
      <button 
        className="btn btn-dark position-relative d-flex align-items-center shadow-lg rounded-pill px-4 py-2"
        onClick={() => navigate('/cart')}
      >
        <span className="me-2 fw-bold text-white">🛒 Cart</span>
        <span className="badge bg-light text-dark ms-2">${totalPrice.toFixed(2)}</span>
        
        {/* NEW BOOTSTRAP FEATURE #2: Positioned Badge (Notification Dot) */}
        {totalItems > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
            {totalItems}
            <span className="visually-hidden">items in cart</span>
          </span>
        )}
      </button>
    </div>
  );
};

export default CartSummary;