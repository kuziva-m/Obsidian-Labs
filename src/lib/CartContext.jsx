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

  // FIXED: Robustly identify items by variantId across all components
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      // Safely extract the variant ID whether it comes from ProductCard or ProductPage
      const incomingVariantId =
        product.variantId ||
        (product.variants && product.variants.length > 0
          ? product.variants[0].id
          : null) ||
        product.id;

      // Check if this EXACT variant is already in the cart
      const existingIndex = prev.findIndex((item) => {
        const currentId =
          item.variantId || (item.variants && item.variants[0]?.id) || item.id;
        return currentId === incomingVariantId;
      });

      if (existingIndex > -1) {
        // If it exists, increase quantity
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      // If it doesn't exist, add as a new item and strictly attach the variantId
      return [...prev, { ...product, variantId: incomingVariantId, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (targetVariantId) => {
    setCart((prev) =>
      prev.filter((item) => {
        const currentId =
          item.variantId || (item.variants && item.variants[0]?.id) || item.id;
        return currentId !== targetVariantId;
      }),
    );
  };

  const updateQuantity = (targetVariantId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) => {
        const currentId =
          item.variantId || (item.variants && item.variants[0]?.id) || item.id;
        return currentId === targetVariantId
          ? { ...item, quantity: newQuantity }
          : item;
      }),
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
