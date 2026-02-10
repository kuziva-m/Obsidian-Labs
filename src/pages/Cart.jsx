import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const updateQuantity = (variantId, change) => {
    const updatedCart = cart.map((item) => {
      if (item.variantId === variantId) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage")); // Update navbar count
  };

  const removeItem = (variantId) => {
    const updatedCart = cart.filter((item) => item.variantId !== variantId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage")); // Update navbar count
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f5] p-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={32} className="text-gray-400" />
        </div>
        <h1 className="font-[Oswald] text-3xl uppercase text-[#1b1b1b] mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-gray-500 mb-8 font-mono">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/shop"
          className="bg-[#ce2a34] text-white py-3 px-8 rounded font-[Oswald] uppercase tracking-widest hover:bg-[#1b1b1b] transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="font-[Oswald] text-4xl uppercase text-[#1b1b1b] mb-12">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* CART ITEMS LIST */}
          <div className="flex-1">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-xs font-bold uppercase text-gray-400 tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="space-y-6 mt-6">
              {cart.map((item) => (
                <div
                  key={item.variantId}
                  className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center border-b border-gray-100 pb-6 last:border-0"
                >
                  {/* Product Info */}
                  <div className="col-span-6 flex items-center gap-4 w-full">
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-bold">
                          IMG
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-[Oswald] uppercase text-lg text-[#1b1b1b]">
                        {item.name}
                      </h3>
                      {item.variants && item.variants[0]?.size_label && (
                        <p className="text-xs text-gray-500 font-mono">
                          Size: {item.variants[0].size_label}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-center font-mono text-gray-600 hidden md:block">
                    ${item.price.toFixed(2)}
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-2 flex items-center justify-between md:justify-center w-full md:w-auto gap-4">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => updateQuantity(item.variantId, -1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-mono text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Mobile Price/Total Display */}
                    <div className="md:hidden font-mono font-bold text-[#1b1b1b]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-gray-400 hover:text-[#ce2a34] transition-colors md:hidden"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Desktop Total & Delete */}
                  <div className="col-span-2 text-right hidden md:flex items-center justify-end gap-6">
                    <span className="font-mono font-bold text-[#1b1b1b]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-gray-400 hover:text-[#ce2a34] transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY SIDEBAR */}
          <div className="w-full lg:w-96">
            <div className="bg-[#f8f8f8] p-8 rounded-lg sticky top-24">
              <h2 className="font-[Oswald] text-xl uppercase mb-6 border-b border-gray-200 pb-4">
                Order Summary
              </h2>

              <div className="flex justify-between mb-4 font-mono text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-6 font-mono text-sm text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="flex justify-between mb-8 text-xl font-bold text-[#1b1b1b]">
                <span className="font-[Oswald] uppercase">Total</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-[#ce2a34] text-white py-4 rounded font-[Oswald] uppercase tracking-widest hover:bg-[#1b1b1b] transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div className="mt-6 text-xs text-center text-gray-400 font-mono">
                Secure Checkout • SSL Encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
