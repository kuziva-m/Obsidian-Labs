import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("obsidian_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("obsidian_cart", JSON.stringify(cart));
  }, [cart]);

  // FIXED: Identify items by variantId instead of product.id
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.variantId === product.variantId,
      );
      if (existing) {
        return prev.map((item) =>
          item.variantId === product.variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (variantId) => {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  // Use the price specifically passed with the variant
  const cartTotal = cart.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
