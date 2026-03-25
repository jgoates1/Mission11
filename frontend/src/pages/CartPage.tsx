import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

function CartPage() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Calculate the grand total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate percentage for our new Bootstrap Progress Bar (caps at 100%)
  const shippingProgress = Math.min((total / 50) * 100, 100);

  return (
    <div className="container-fluid mt-4 px-4">
      <h2 className="mb-4 text-dark">Your Shopping Cart</h2>
      
      {/* NEW BOOTSTRAP FEATURE #1: Progress Bar */}
      <div className="mb-4 p-3 bg-light border rounded shadow-sm">
        <h5 className="text-dark">Free Shipping Goal ($50)</h5>
        <div className="progress" style={{ height: '25px' }}>
          <div 
            className={`progress-bar ${shippingProgress === 100 ? 'bg-success' : 'bg-info progress-bar-striped progress-bar-animated'}`} 
            role="progressbar" 
            style={{ width: `${shippingProgress}%` }}
          >
            {shippingProgress === 100 ? "Free Shipping Unlocked!" : `$${(50 - total).toFixed(2)} away from Free Shipping`}
          </div>
        </div>
      </div>

      {/* Conditional rendering: check if the cart is empty */}
      {cart.length === 0 ? (
        <div className="alert alert-info">
          Your cart is currently empty.
        </div>
      ) : (
        <table className="table table-bordered table-striped shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Book Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.bookId}>
                <td>{item.title}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.bookId)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-end fw-bold">Grand Total:</td>
              <td className="fw-bold">${total.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      )}

      <div className="mt-4">
        <button className="btn btn-primary me-2" onClick={() => navigate(-1)}>
          Continue Shopping
        </button>
        {cart.length > 0 && (
          <button className="btn btn-success" onClick={() => alert("Checkout coming soon!")}>
            Checkout
          </button>
        )}
      </div>
    </div>
  );
}

export default CartPage;