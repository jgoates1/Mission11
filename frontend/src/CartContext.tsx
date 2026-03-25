import { createContext, useContext, useState, type ReactNode } from 'react';

// 1. Define the structure of a single item in the cart
export interface CartItem {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
}

// 2. Define what the Context will hold (the array of items, and the functions to modify them)
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
}

// 3. Create the Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// 4. Create the Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
    // Global state for the cart
    const [cart, setCart] = useState<CartItem[]>([]);
  
    const addToCart = (item: CartItem) => {
      setCart((prevCart) => {
        // Check if the book already exists in the cart using .find()
        const existingItem = prevCart.find((i) => i.bookId === item.bookId);
  
        if (existingItem) {
          // If it exists, map through the cart and increase the quantity of the matching book
          return prevCart.map((i) =>
            i.bookId === item.bookId
              ? { ...i, quantity: i.quantity + 1 } 
              : i
          );
        } else {
          // If it doesn't exist, use the spread operator to add the brand-new item
          return [...prevCart, item];
        }
      });
    };
  
    const removeFromCart = (bookId: number) => {
      // Use .filter() to keep every item EXCEPT the one that matches the ID we want to remove
      setCart((prevCart) => prevCart.filter((item) => item.bookId !== bookId));
    };
  
    const clearCart = () => {
      setCart([]);
    };
  
    return (
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
        {children}
      </CartContext.Provider>
    );
  }

// 5. Create a Custom Hook so other components can easily grab the cart data
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}