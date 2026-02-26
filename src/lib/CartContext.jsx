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

  // FIXED: Robustly identify items and isolate their specific size label
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      // 1. Find the incoming Variant ID
      const incomingVariantId =
        product.variantId ||
        (product.variants && product.variants.length > 0
          ? product.variants[0].id
          : null) ||
        product.id;

      // 2. Check if this EXACT variant is already in the cart
      const existingIndex = prev.findIndex((item) => {
        const currentId =
          item.variantId || (item.variants && item.variants[0]?.id) || item.id;
        return currentId === incomingVariantId;
      });

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      // 3. ISOLATE THE SELECTED VARIANT
      // We look through the database array to find the exact variant the user picked
      let specificVariant = null;
      if (product.variants) {
        specificVariant = product.variants.find(
          (v) => v.id === incomingVariantId,
        );
      }

      // 4. ADD NEW ITEM
      // We overwrite the "variants" array to ONLY contain the single size they picked.
      // This forces the Checkout page to always display the correct label.
      const newItem = {
        ...product,
        variantId: incomingVariantId,
        quantity,
        variants: specificVariant ? [specificVariant] : product.variants,
        sizeLabel: specificVariant
          ? specificVariant.size_label
          : product.sizeLabel || "",
      };

      return [...prev, newItem];
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
