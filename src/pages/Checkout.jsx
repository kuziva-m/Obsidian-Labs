import { useState, useEffect } from "react";
import { useCart } from "../lib/CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  ArrowLeft,
  Loader,
  Truck,
  Landmark,
  AlertTriangle,
  Copy,
  Upload,
  CheckCircle,
} from "lucide-react";
import SEO from "../components/SEO";

export default function Checkout() {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();

  // --- PRE-GENERATE ORDER ID (Used for the Reference Number) ---
  const [orderId] = useState(() => crypto.randomUUID());
  const shortRef = orderId.slice(0, 8).toUpperCase();

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    postcode: "",
  });

  // --- UPLOAD STATE ---
  const [receiptFile, setReceiptFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/products");
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const getVariantLabel = (item) => {
    if (item.variants && item.variants.length > 0)
      return item.variants[0].size_label;
    if (item.sizeLabel) return item.sizeLabel;
    if (item.variant && item.variant.size_label) return item.variant.size_label;
    return "";
  };

  // --- SHIPPING CALCULATIONS ---
  const isExpressFree = cartTotal >= 250;
  const shippingCost = isExpressFree ? 0 : 14.99;
  const shippingLabel = isExpressFree ? "Free" : "$14.99";
  const estimatedTotal = cartTotal + shippingCost;

  // --- FINAL SUBMIT ---
  const submitOrder = async (e) => {
    e.preventDefault();
    if (!receiptFile) {
      setError(
        "Please upload your payment screenshot before completing the order.",
      );
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Upload the Receipt Image to Supabase Storage
      const fileExt = receiptFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(fileName, receiptFile);

      if (uploadError)
        throw new Error("Failed to upload receipt image. Please try again.");

      const { data: publicUrlData } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(fileName);

      const receiptUrl = publicUrlData.publicUrl;

      // 2. Insert Order into Database
      const orderPayload = {
        id: orderId,
        customer_name: formData.name,
        customer_email: formData.email,
        total_amount: estimatedTotal,
        shipping_cost: shippingCost,
        shipping_method: "Express",
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
          size: getVariantLabel(item),
        }));

        // Customer Email
        await supabase.functions.invoke("send-email", {
          body: {
            email: formData.email,
            name: formData.name,
            orderId: orderId,
            status: "custom", // Retains the bank details layout in the email template
            message:
              "Thank you for your order! We have received your payment confirmation screenshot and are currently verifying the transfer. We will notify you with tracking information as soon as your package is dispatched.",
            items: emailItems,
            address: formData,
            totalAmount: estimatedTotal,
            shippingCost: shippingCost,
          },
        });

        // Admin Email
        const adminHtml = `
          <div style="font-family: Arial, sans-serif;">
            <h2 style="color: #ce2a34; text-transform: uppercase;">🚨 New Order Received: #${shortRef}</h2>
            <p><strong>Customer:</strong> ${formData.name} (<a href="mailto:${formData.email}">${formData.email}</a>)</p>
            <p><strong>Total:</strong> $${estimatedTotal.toFixed(2)}</p>
            <p><strong>Status:</strong> Customer uploaded payment proof. Awaiting your approval.</p>
            <br/>
            <a href="${receiptUrl}" style="display: inline-block; background-color: #1b1b1b; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Payment Proof</a>
          </div>
        `;

        await supabase.functions.invoke("send-email", {
          body: {
            to: "obsidianlabsau@gmail.com",
            subject: `🚨 Payment Proof Uploaded! Order #${shortRef}`,
            html: adminHtml,
          },
        });
      } catch (emailErr) {
        console.error("Failed to send notification emails:", emailErr);
      }

      // 4. FIRE GOOGLE ANALYTICS & META ADS PURCHASE EVENTS
      if (typeof window !== "undefined") {
        if (window.gtag) {
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
        if (window.fbq) {
          window.fbq("track", "Purchase", {
            value: estimatedTotal,
            currency: "AUD",
          });
        }
      }

      // 5. Redirect to Success Page
      navigate(`/success?order_id=${orderId}`);
    } catch (err) {
      console.error("Checkout Error:", err);
      setError(err.message || "Failed to submit order. Please try again.");
      setIsLoading(false);
    }
  };

  if (!cart || cart.length === 0) return null;

  return (
    <div className="bg-[#f4f4f5] min-h-screen py-12">
      <SEO title="Secure Checkout - Obsidian Labs" />
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-gray-500 hover:text-[#ce2a34] font-mono text-sm uppercase mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* --- LEFT: FORM & PAYMENT DETAILS --- */}
          <div className="lg:col-span-7 xl:col-span-8">
            <h1 className="font-oswald text-4xl uppercase text-[#1b1b1b] mb-2">
              Secure Checkout
            </h1>
            <p className="text-gray-500 font-body mb-8">
              Complete your shipping details, transfer the total amount, and
              upload your receipt below to secure your order.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 font-body flex items-center gap-2">
                <AlertTriangle size={18} /> {error}
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

              {/* 3. PAYMENT DETAILS & UPLOAD */}
              <div className="bg-white p-6 md:p-8 rounded shadow-sm border border-gray-200">
                <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-6 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Landmark size={20} className="text-[#ce2a34]" /> 3. Payment
                  Instructions
                </h3>

                {/* Important Notice */}
                <div className="bg-gray-50 border border-gray-200 border-l-4 border-l-[#ce2a34] p-5 rounded-r mb-8 shadow-sm">
                  <h4 className="font-oswald text-lg uppercase text-[#1b1b1b] mb-3 flex items-center gap-2">
                    <AlertTriangle className="text-[#ce2a34]" size={20} />{" "}
                    Important Payment Notice
                  </h4>
                  <div className="text-gray-600 font-body text-sm space-y-3 leading-relaxed">
                    <p>
                      Please note that when completing your bank transfer, you
                      may receive a warning stating that the account name does
                      not match the business name.
                    </p>
                    <p className="font-bold text-[#1b1b1b]">
                      This is normal and expected.
                    </p>
                    <p>
                      During the interim period while our official business
                      banking is being finalised, payments are processed through
                      a secure personal account. For brand consistency and
                      privacy protection, we display our registered business
                      name on invoices and checkout.
                    </p>
                    <p>
                      You may proceed with the transfer as normal. Once payment
                      has been completed, please upload your payment
                      confirmation screenshot below so we can promptly verify
                      and process your order.
                    </p>
                  </div>
                </div>

                {/* Bank Details Box */}
                <div className="bg-gray-50 p-6 rounded border border-gray-200 space-y-4 font-mono text-sm mb-8 shadow-inner">
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
                        onClick={(e) => {
                          e.preventDefault();
                          handleCopy("Obsidian Labs AU", "name");
                        }}
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
                        onClick={(e) => {
                          e.preventDefault();
                          handleCopy("944100", "bsb");
                        }}
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
                        onClick={(e) => {
                          e.preventDefault();
                          handleCopy("550842162", "acc");
                        }}
                        className="text-gray-400 hover:text-[#ce2a34]"
                      >
                        {copied === "acc" ? "Copied!" : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-[#ce2a34] text-white p-4 rounded mt-4 shadow-md">
                    <span className="uppercase tracking-widest text-red-100">
                      Reference:
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">#{shortRef}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCopy(shortRef, "ref");
                        }}
                        className="text-red-200 hover:text-white"
                      >
                        {copied === "ref" ? "Copied!" : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="pt-4 mt-2 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-gray-500 uppercase">
                      Total to Transfer
                    </span>
                    <span className="font-bold text-[#1b1b1b] text-xl">
                      ${estimatedTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Upload Screenshot */}
                <div>
                  <h4 className="font-oswald text-md uppercase text-[#1b1b1b] mb-2 flex items-center gap-2">
                    <Upload size={16} className="text-[#ce2a34]" /> Upload
                    Payment Screenshot
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Required to submit your order.
                  </p>

                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${previewUrl ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {previewUrl ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-40 rounded shadow-sm border border-green-200 mb-2"
                        />
                        <p className="text-xs text-gray-500 font-mono flex items-center gap-1">
                          <CheckCircle size={12} className="text-green-500" />{" "}
                          Image Attached (Click to change)
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Upload
                          size={32}
                          className="text-gray-400 mx-auto mb-3"
                        />
                        <p className="font-oswald uppercase text-[#1b1b1b]">
                          Select Receipt Image
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Tap or drag image here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading || !receiptFile}
                className="w-full bg-[#ce2a34] text-white font-oswald uppercase tracking-widest text-lg py-5 rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} /> Processing
                    Order...
                  </>
                ) : (
                  "Complete Order"
                )}
              </button>
            </form>
          </div>

          {/* --- RIGHT: SUMMARY (STICKY) --- */}
          <div className="lg:col-span-5 xl:col-span-4 relative">
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
                          <p className="font-oswald uppercase text-[#1b1b1b] leading-tight">
                            {item.name}
                          </p>
                          {safeVariant && (
                            <p className="text-sm text-gray-500 font-mono mt-1">
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
                <span>Total</span>
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
