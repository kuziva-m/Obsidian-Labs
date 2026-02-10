import { useState } from "react";
import { useCart } from "../lib/CartContext";
import { X, Minus, Plus, Trash2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom"; // <--- Added this

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  const navigate = useNavigate(); // <--- Hook for navigation

  if (!isCartOpen) return null;

  // UPDATED: Simply goes to the new Checkout Page
  const handleToCheckout = () => {
    setIsCartOpen(false); // Close the drawer first
    navigate("/checkout"); // Go to the page
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-[#f0f4f8] border-l-4 border-[var(--baltic-sea)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 bg-[var(--baltic-sea)] text-white flex justify-between items-center">
          <h2 className="font-[Oswald] text-2xl uppercase tracking-widest">
            Cart ({cart.length})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="hover:text-[var(--brick-red)] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-10 opacity-50 font-mono uppercase text-gray-500">
              // Cart is Empty //
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-white border-2 border-gray-200 p-4 flex gap-4 shadow-sm"
              >
                {/* Image */}
                <div className="w-20 h-20 bg-gray-100 border border-gray-200 flex-shrink-0">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-[Oswald] uppercase text-[var(--baltic-sea)] leading-tight mb-1">
                    {item.name}
                  </h3>
                  {/* Price */}
                  <p className="font-mono text-xs text-gray-500 mb-3">
                    ${item.variants?.[0]?.price} / unit
                  </p>

                  <div className="flex justify-between items-center">
                    {/* Qty Controls */}
                    <div className="flex items-center border border-gray-300 bg-gray-50">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 py-1 hover:bg-gray-200 text-[var(--baltic-sea)] transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 font-mono text-sm font-bold text-[var(--baltic-sea)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 hover:bg-gray-200 text-[var(--baltic-sea)] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-[var(--brick-red)] transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t-2 border-[var(--baltic-sea)]">
          <div className="flex justify-between items-end mb-4 font-[Oswald] text-xl uppercase text-[var(--baltic-sea)]">
            <span>Total</span>
            <span className="text-[var(--brick-red)] font-bold">
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleToCheckout} // Calls the navigation function
            disabled={cart.length === 0}
            className="w-full bg-[var(--brick-red)] text-white py-4 font-[Oswald] uppercase tracking-widest text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]"
          >
            <Lock size={18} /> Secure Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
