import { useState } from "react";
import { useCart } from "../lib/CartContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  value,
  onChange,
}) => (
  <div className="flex flex-col gap-2">
    <label className="font-[Oswald] text-base uppercase text-gray-700 tracking-wide font-bold">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      required={required}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 border-2 border-gray-300 bg-white text-black font-mono text-base rounded-md focus:border-[#ce2a34] focus:ring-0 outline-none placeholder-gray-400 transition-all"
    />
  </div>
);

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    suburb: "",
    state: "",
    postcode: "",
    country: "Australia",
  });

  const isFreeShipping = cartTotal > 239.99;
  const shippingCost = isFreeShipping ? 0 : 14.99;
  const finalTotal = cartTotal + shippingCost;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("checkout", {
        body: {
          items: cart,
          customerDetails: formData,
          shippingMethod: isFreeShipping ? "free_express" : "express",
          shippingCost: shippingCost,
        },
      });

      if (error) throw error;

      if (data?.orderId) {
        clearCart();
        navigate(`/success?orderId=${data.orderId}`);
      }
    } catch (err) {
      console.error("Order failed:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0)
    return (
      <div className="p-20 text-center font-[Oswald] text-black text-xl">
        YOUR CART IS EMPTY
      </div>
    );

  return (
    <div className="bg-[#f4f4f5] min-h-screen py-10 md:py-20">
      <SEO title="Checkout" />
      <div className="container mx-auto px-4 max-w-6xl pt-24 md:pt-32">
        <h1 className="font-[Oswald] text-5xl uppercase mb-10 text-[#1b1b1b]">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT: FORM */}
          <div className="bg-white p-8 border-2 border-[#1b1b1b] shadow-sm rounded-md">
            <h2 className="font-[Oswald] text-3xl uppercase mb-8 text-[#1b1b1b] border-b-2 border-gray-100 pb-4">
              1. Billing & Shipping
            </h2>

            <form
              id="checkout-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                <InputField
                  label="First Name"
                  name="firstName"
                  placeholder="e.g. Lachlan"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <InputField
                  label="Last Name"
                  name="lastName"
                  placeholder="e.g. Henderson"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="l.henderson@outlook.com"
                value={formData.email}
                onChange={handleChange}
              />

              <InputField
                label="Street Address"
                name="address"
                placeholder="e.g. Unit 402, 88 Collins St"
                value={formData.address}
                onChange={handleChange}
              />

              <div className="grid grid-cols-2 gap-6">
                <InputField
                  label="Suburb"
                  name="suburb"
                  placeholder="e.g. Melbourne"
                  value={formData.suburb}
                  onChange={handleChange}
                />
                <InputField
                  label="State"
                  name="state"
                  placeholder="e.g. VIC"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <InputField
                  label="Postcode"
                  name="postcode"
                  placeholder="e.g. 3000"
                  value={formData.postcode}
                  onChange={handleChange}
                />
                <InputField
                  label="Phone (Optional)"
                  name="phone"
                  placeholder="0412 345 678"
                  required={false}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </form>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="bg-[#1b1b1b] text-white p-8 h-fit border-2 border-[#1b1b1b] shadow-md rounded-md">
            <h2 className="font-[Oswald] text-3xl uppercase mb-8 border-b border-gray-600 pb-4 text-white">
              2. Your Order
            </h2>

            <div className="space-y-4 mb-8 font-mono text-base">
              <div className="flex justify-between uppercase text-gray-300 font-bold tracking-wider">
                <span>Product</span>
                <span>Subtotal</span>
              </div>
              {cart.map((item) => (
                <div
                  /* FIXED: Use variantId as the key */
                  key={item.variantId}
                  className="flex justify-between border-b border-gray-700 pb-3 text-white"
                >
                  <span className="flex flex-col">
                    <span className="font-bold">{item.name}</span>
                    {/* FIXED: Show the specific strength/size */}
                    <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
                      Strength: {item.sizeLabel || "Standard"} x {item.quantity}
                    </span>
                  </span>
                  {/* FIXED: Use item.price (variant-specific) instead of item.variants[0] */}
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 font-[Oswald] text-xl uppercase tracking-wider mb-8">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between items-center border-t-2 border-gray-600 pt-4 mt-4">
                <span className="text-white font-bold text-2xl">Total</span>
                <span className="text-4xl text-[#ce2a34] font-bold">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-[#2a2a2a] p-6 mb-8 border border-gray-600 rounded-md">
              <p className="font-[Oswald] uppercase text-white mb-4 text-lg tracking-wide">
                Payment Method
              </p>

              <div className="font-mono text-sm text-white flex items-center gap-3 bg-black/40 p-4 border border-gray-600 rounded-md">
                <span className="w-4 h-4 bg-[#ce2a34] rounded-full shadow-[0_0_8px_rgba(206,42,52,0.8)] border border-red-900"></span>
                Direct Bank Transfer
              </div>

              <p className="font-mono text-sm text-gray-400 mt-4 leading-relaxed">
                Make your payment directly into our bank account. Banking
                details will be provided immediately after you place your order.
              </p>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full bg-[#ce2a34] text-white py-5 font-[Oswald] uppercase tracking-widest text-2xl hover:bg-red-600 transition-all border-2 border-transparent hover:border-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg rounded-md"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
