import { useCart } from "../lib/CartContext";
import { X, Minus, Plus, Trash2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleToCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-[1001] flex justify-end">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="relative w-[85vw] md:w-full md:max-w-md h-full bg-white/95 backdrop-blur-md border-l-4 border-[var(--baltic-sea)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 bg-[var(--baltic-sea)] text-white flex justify-between items-center">
          <h2 className="font-[Oswald] text-2xl uppercase tracking-widest">
            Cart ({cart.length})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 -mr-2 text-white hover:text-[var(--brick-red)] transition-colors"
          >
            <X size={28} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 opacity-30 font-[Oswald] uppercase text-gray-500 tracking-widest">
              Your Cart is Empty
            </div>
          ) : (
            cart.map((item) => (
              /* Use variantId for the key so multiple strengths of one product show separately */
              <div
                key={item.variantId}
                className="bg-white border-2 border-gray-100 p-4 flex gap-4 shadow-sm"
              >
                <div className="w-20 h-20 bg-gray-50 border border-gray-200 flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xs">
                      LABS
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-[Oswald] uppercase text-[var(--baltic-sea)] leading-tight mb-1 text-sm font-bold">
                    {item.name}
                  </h3>
                  <p className="font-mono text-[10px] text-gray-400 mb-3 uppercase">
                    {item.sizeLabel} • ${item.price} / unit
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center border-2 border-[var(--baltic-sea)] bg-white">
                      <button
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity - 1)
                        }
                        className="px-2 py-1 hover:bg-gray-100 text-[var(--baltic-sea)]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 font-mono text-sm font-bold text-[var(--baltic-sea)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity + 1)
                        }
                        className="px-2 py-1 hover:bg-gray-100 text-[var(--baltic-sea)]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.variantId)}
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

        <div className="p-6 bg-gray-50 border-t-2 border-[var(--baltic-sea)]">
          <div className="flex justify-between items-end mb-6 font-[Oswald] text-xl uppercase text-[var(--baltic-sea)]">
            <span className="text-sm text-gray-500 tracking-widest">
              Subtotal
            </span>
            <span className="text-[var(--brick-red)] font-bold text-2xl">
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleToCheckout}
            disabled={cart.length === 0}
            className="w-full bg-[var(--baltic-sea)] text-white py-5 font-[Oswald] uppercase tracking-widest text-lg hover:bg-[var(--brick-red)] transition-all flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]"
          >
            {/* UPDATED: Change button text to "Place Order" */}
            <Lock size={18} /> Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
