import { useState, useEffect } from "react";
import { useCart } from "../lib/CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Loader, Truck } from "lucide-react";
import SEO from "../components/SEO";

export default function Checkout() {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();

  // --- PRE-GENERATE ORDER ID ---
  const [orderId] = useState(() => crypto.randomUUID());
  const shortRef = orderId.slice(0, 8).toUpperCase();

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    postcode: "",
  });

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/shop");
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getVariantLabel = (item) => {
    if (item.variants && item.variants.length > 0)
      return item.variants[0].size_label;
    if (item.sizeLabel) return item.sizeLabel;
    if (item.variant && item.variant.size_label) return item.variant.size_label;
    return "";
  };

  // --- SHIPPING CALCULATIONS (EXPRESS ONLY) ---
  const isExpressFree = cartTotal >= 150;
  const shippingCost = isExpressFree ? 0 : 14.99;
  const shippingLabel = isExpressFree ? "Free" : "$14.99";
  const estimatedTotal = cartTotal + shippingCost;

  // --- FINAL SUBMIT ---
  const submitOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Insert Order
      const orderPayload = {
        id: orderId,
        customer_name: formData.name,
        customer_email: formData.email,
        total_amount: estimatedTotal,
        shipping_cost: shippingCost,
        shipping_method: "Express",
        shipping_address: formData,
        items: cart,
        receipt_url: "No screenshot provided", // Default since upload is removed
        status: "pending",
      };

      const { error: orderError } = await supabase
        .from("orders")
        .insert(orderPayload);
      if (orderError) throw orderError;

      // 2. SEND EMAILS
      try {
        const emailItems = cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          size: getVariantLabel(item),
        }));

        // A. Customer Email
        await supabase.functions.invoke("send-email", {
          body: {
            email: formData.email,
            name: formData.name,
            orderId: orderId,
            status: "custom",
            message:
              "Thank you for your order! To complete your purchase, please make a bank transfer using the details provided below. We will notify you as soon as your payment is confirmed and your package is dispatched.",
            items: emailItems,
            address: formData,
            totalAmount: estimatedTotal, // Pass total to email for bank instructions
          },
        });

        // B. Admin Email
        const adminHtml = `
          <div style="font-family: Arial, sans-serif;">
            <h2 style="color: #ce2a34; text-transform: uppercase;">🚨 New Order: #${shortRef}</h2>
            <p><strong>Customer:</strong> ${formData.name} (<a href="mailto:${formData.email}">${formData.email}</a>)</p>
            <p><strong>Total:</strong> $${estimatedTotal.toFixed(2)}</p>
            <p><strong>Shipping:</strong> Express</p>
            <p><em>*Awaiting customer bank transfer.</em></p>
          </div>
        `;

        await supabase.functions.invoke("send-email", {
          body: {
            to: "obsidianlabsau@gmail.com",
            subject: `🚨 New Order Received! #${shortRef}`,
            html: adminHtml,
          },
        });
      } catch (emailErr) {
        console.error("Failed to send notification emails:", emailErr);
      }

      // 3. FIRE GOOGLE ANALYTICS & ADS PURCHASE EVENTS
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "purchase", {
          transaction_id: orderId,
          value: estimatedTotal,
          currency: "AUD",
          items: cart.map((item) => ({
            item_name: item.name,
            price: item.price,
            quantity: item.quantity,
            item_variant: getVariantLabel(item),
          })),
        });

        window.gtag("event", "ads_conversion_Purchase_1", {
          transaction_id: orderId,
          value: estimatedTotal,
          currency: "AUD",
        });
      }

      // 4. Redirect to Success Page
      navigate(`/success?order_id=${orderId}`);
    } catch (err) {
      console.error("Checkout Error:", err);
      setError(err.message || "Failed to submit order. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart || cart.length === 0) return null;

  return (
    <div className="bg-[#f4f4f5] min-h-screen py-12">
      <SEO title="Secure Checkout - Obsidian Labs" />
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 text-gray-500 hover:text-[#ce2a34] font-mono text-sm uppercase mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* --- LEFT: FORM --- */}
          <div>
            <h1 className="font-oswald text-4xl uppercase text-[#1b1b1b] mb-2">
              Secure Checkout
            </h1>
            <p className="text-gray-500 font-body mb-8">
              Complete your shipping details below. Payment instructions will be
              provided on the next step.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 font-body">
                {error}
              </div>
            )}

            <form onSubmit={submitOrder} className="space-y-8">
              {/* 1. SHIPPING DETAILS */}
              <div className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-200">
                <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-4 border-b border-gray-100 pb-2">
                  1. Shipping Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded font-body focus:outline-none focus:border-[#1b1b1b]"
                  />
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded font-body focus:outline-none focus:border-[#1b1b1b]"
                  />
                  <input
                    required
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded font-body focus:outline-none focus:border-[#1b1b1b] md:col-span-2"
                  />
                  <input
                    required
                    type="text"
                    name="line1"
                    placeholder="Street Address"
                    value={formData.line1}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded font-body focus:outline-none focus:border-[#1b1b1b] md:col-span-2"
                  />
                  <input
                    required
                    type="text"
                    name="city"
                    placeholder="City / Suburb"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded font-body focus:outline-none focus:border-[#1b1b1b]"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      type="text"
                      name="state"
                      placeholder="State (VIC)"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded font-body focus:outline-none focus:border-[#1b1b1b]"
                    />
                    <input
                      required
                      type="text"
                      name="postcode"
                      placeholder="Postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded font-body focus:outline-none focus:border-[#1b1b1b]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. SHIPPING SPEED (EXPRESS ONLY) */}
              <div className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-200">
                <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Truck size={20} className="text-[#ce2a34]" /> 2. Shipping
                  Method
                </h3>
                <div className="p-4 rounded border-2 border-[#1b1b1b] bg-[#1b1b1b] text-white flex justify-between items-center shadow-md">
                  <span className="block font-oswald uppercase tracking-wide text-lg">
                    Express Post
                  </span>
                  <span
                    className={
                      isExpressFree
                        ? "text-green-400 font-bold"
                        : "text-gray-300"
                    }
                  >
                    {shippingLabel}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ce2a34] text-white font-oswald uppercase tracking-widest text-lg py-5 rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 flex justify-center items-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} /> Processing...
                  </>
                ) : (
                  "Complete Order"
                )}
              </button>
            </form>
          </div>

          {/* --- RIGHT: SUMMARY --- */}
          <div className="relative">
            <div className="sticky top-24 bg-white p-6 md:p-8 rounded shadow-sm border border-[#1b1b1b] border-t-4">
              <h3 className="font-oswald text-2xl uppercase text-[#1b1b1b] mb-6">
                Order Summary
              </h3>
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map((item, i) => {
                  const safeVariant = getVariantLabel(item);
                  return (
                    <div
                      key={i}
                      className="flex justify-between items-center gap-4 border-b border-gray-100 pb-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={item.image_url || item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded bg-gray-50 border border-gray-200"
                        />
                        <div>
                          <p className="font-oswald uppercase text-[#1b1b1b]">
                            {item.name}
                          </p>
                          {safeVariant && (
                            <p className="text-sm text-gray-500 font-mono">
                              {safeVariant}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 font-mono">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-oswald text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 font-mono text-sm text-gray-600 border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping (Express)</span>
                  <span
                    className={
                      shippingCost === 0 ? "text-green-600 font-bold" : ""
                    }
                  >
                    {shippingLabel}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center font-oswald text-2xl text-[#1b1b1b] uppercase">
                <span>Total to Pay</span>
                <span className="text-[#ce2a34]">
                  ${estimatedTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
