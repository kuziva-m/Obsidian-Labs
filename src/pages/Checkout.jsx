import { useState, useEffect } from "react";
import { useCart } from "../lib/CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  ArrowLeft,
  Loader,
  Truck,
  Copy,
  Upload,
  CheckCircle,
  Landmark,
} from "lucide-react";
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
  const [copied, setCopied] = useState("");

  // File Upload State
  const [receiptFile, setReceiptFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    postcode: "",
  });

  const [shippingMethod, setShippingMethod] = useState("standard");

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/shop");
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const getVariantLabel = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") return v.size_label || "Option";
    return String(v);
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  // --- SHIPPING CALCULATIONS ---
  const isStandardFree = cartTotal >= 150;
  const isExpressFree = cartTotal >= 250;

  let shippingCost = 0;
  let shippingLabel = "Free";

  if (shippingMethod === "express") {
    shippingCost = isExpressFree ? 0 : 15.0;
    shippingLabel = isExpressFree ? "Free" : "$15.00";
  } else {
    shippingCost = isStandardFree ? 0 : 10.0;
    shippingLabel = isStandardFree ? "Free" : "$10.00";
  }

  const estimatedTotal = cartTotal + shippingCost;

  // --- FINAL SUBMIT ---
  const submitOrder = async (e) => {
    e.preventDefault();

    if (!receiptFile) {
      setError(
        "Please upload a screenshot of your payment receipt to complete your order.",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Upload the Receipt Image
      const fileExt = receiptFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(fileName, receiptFile);

      if (uploadError)
        throw new Error(
          "Failed to upload receipt. Please ensure the file is a valid image.",
        );

      const { data: publicUrlData } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(fileName);

      const receiptUrl = publicUrlData.publicUrl;

      // 2. Insert Order
      const orderPayload = {
        id: orderId,
        customer_name: formData.name,
        customer_email: formData.email,
        total_amount: estimatedTotal,
        shipping_cost: shippingCost,
        shipping_method: shippingMethod === "express" ? "Express" : "Standard",
        shipping_address: formData,
        items: cart,
        receipt_url: receiptUrl,
        status: "pending",
      };

      const { error: orderError } = await supabase
        .from("orders")
        .insert(orderPayload);
      if (orderError) throw orderError;

      // 3. SEND EMAILS
      try {
        const emailItems = cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          size: getVariantLabel(item.variant),
        }));

        // A. Customer Email
        await supabase.functions.invoke("send-email", {
          body: {
            email: formData.email,
            name: formData.name,
            orderId: orderId,
            status: "custom",
            message:
              "Thank you for your order! We have received your payment proof. Your order is currently under review and we will notify you as soon as your payment is confirmed and your package is dispatched.",
            items: emailItems,
            address: formData,
          },
        });

        // B. Admin Email (Updated to your Obsidian email)
        const adminHtml = `
          <div style="font-family: Arial, sans-serif;">
            <h2 style="color: #ce2a34; text-transform: uppercase;">🚨 New Order: #${shortRef}</h2>
            <p><strong>Customer:</strong> ${formData.name} (<a href="mailto:${formData.email}">${formData.email}</a>)</p>
            <p><strong>Total:</strong> $${estimatedTotal.toFixed(2)}</p>
            <p><strong>Shipping:</strong> ${shippingMethod === "express" ? "Express" : "Standard"}</p>
            <br/>
            <p><strong>Payment Proof:</strong></p>
            <a href="${receiptUrl}" target="_blank" style="background: #1b1b1b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Receipt</a>
          </div>
        `;

        await supabase.functions.invoke("send-email", {
          body: {
            to: "obsidianlabsau@gmail.com",
            subject: `🚨 Payment Uploaded! Order #${shortRef}`,
            html: adminHtml,
          },
        });
      } catch (emailErr) {
        console.error("Failed to send notification emails:", emailErr);
      }

      // 4. Redirect
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
              Complete your shipping details, initiate your bank transfer, and
              upload proof of payment below.
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

              {/* 2. SHIPPING SPEED */}
              <div className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-200">
                <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Truck size={20} className="text-[#ce2a34]" /> 2. Shipping
                  Method
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div
                    onClick={() => setShippingMethod("standard")}
                    className={`flex-1 p-4 rounded cursor-pointer border-2 transition-all ${shippingMethod === "standard" ? "border-[#1b1b1b] bg-[#1b1b1b] text-white shadow-md" : "border-gray-200 bg-gray-50 text-[#1b1b1b] hover:border-gray-400"}`}
                  >
                    <span className="block font-oswald uppercase tracking-wide text-lg mb-1">
                      Standard
                    </span>
                    <span
                      className={`text-sm ${shippingMethod === "standard" ? "text-gray-300" : "text-gray-500"}`}
                    >
                      {isStandardFree ? "Free (Over $150)" : "$10.00"}
                    </span>
                  </div>
                  <div
                    onClick={() => setShippingMethod("express")}
                    className={`flex-1 p-4 rounded cursor-pointer border-2 transition-all ${shippingMethod === "express" ? "border-[#ce2a34] bg-[#ce2a34] text-white shadow-md" : "border-gray-200 bg-gray-50 text-[#1b1b1b] hover:border-gray-400"}`}
                  >
                    <span className="block font-oswald uppercase tracking-wide text-lg mb-1">
                      Express Post
                    </span>
                    <span
                      className={`text-sm ${shippingMethod === "express" ? "text-gray-200" : "text-gray-500"}`}
                    >
                      {isExpressFree ? "Free (Over $250)" : "$15.00"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. PAYMENT DETAILS */}
              <div className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-200">
                <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Landmark size={20} className="text-[#ce2a34]" /> 3. Payment
                  Transfer
                </h3>
                <p className="text-gray-600 font-body mb-6">
                  Please transfer{" "}
                  <strong className="text-[#ce2a34] text-lg">
                    ${estimatedTotal.toFixed(2)}
                  </strong>{" "}
                  to the account below.
                </p>

                <div className="bg-gray-50 p-6 rounded border border-gray-200 space-y-4 font-mono text-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-500 uppercase">
                      Account Name
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#1b1b1b] text-base">
                        Obsidian Labs AU
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy("Obsidian Labs AU", "name")}
                        className="text-gray-400 hover:text-[#ce2a34]"
                      >
                        {copied === "name" ? "Copied!" : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-500 uppercase">BSB</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#1b1b1b] text-base">
                        944-100
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy("944100", "bsb")}
                        className="text-gray-400 hover:text-[#ce2a34]"
                      >
                        {copied === "bsb" ? "Copied!" : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-500 uppercase">
                      Account Number
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#1b1b1b] text-base">
                        5508 42162
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy("550842162", "acc")}
                        className="text-gray-400 hover:text-[#ce2a34]"
                      >
                        {copied === "acc" ? "Copied!" : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-[#1b1b1b] text-white p-4 rounded mt-4">
                    <span className="uppercase tracking-widest text-gray-400">
                      Reference:
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">#{shortRef}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(shortRef, "ref")}
                        className="text-gray-400 hover:text-white"
                      >
                        {copied === "ref" ? "Copied!" : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. UPLOAD PROOF */}
              <div className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-200">
                <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-4 border-b border-gray-100 pb-2">
                  4. Upload Proof
                </h3>

                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${previewUrl ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
                >
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />

                  {previewUrl ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle size={32} className="text-green-600 mb-2" />
                      <p className="font-oswald uppercase tracking-wide text-green-700 mb-4">
                        Receipt Attached
                      </p>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-32 rounded shadow-sm border border-green-200"
                      />
                      <p className="text-xs text-gray-500 mt-4 font-mono">
                        Click to replace
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload
                        size={32}
                        className="text-gray-400 mx-auto mb-3"
                      />
                      <p className="font-oswald uppercase text-[#1b1b1b] text-lg">
                        Upload Payment Screenshot
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Tap here or drag an image
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !receiptFile}
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

              <div className="space-y-4 mb-6">
                {cart.map((item, i) => {
                  const safeVariant = getVariantLabel(item.variant);
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
                  <span>Shipping ({shippingMethod})</span>
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
