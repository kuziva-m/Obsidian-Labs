import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../lib/CartContext";
import { CheckCircle, ArrowRight, Landmark, Copy } from "lucide-react";
import SEO from "../components/SEO";

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { clearCart } = useCart();
  const [copied, setCopied] = useState("");

  const shortRef = orderId ? orderId.slice(0, 8).toUpperCase() : "";

  useEffect(() => {
    // Clear the cart on successful order
    clearCart();
    // Scroll to top
    window.scrollTo(0, 0);
  }, [clearCart]);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="bg-[#f4f4f5] min-h-screen py-16 px-4 flex items-center justify-center">
      <SEO title="Order Received - Obsidian Labs" />

      <div className="max-w-xl w-full bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
        {/* Header Section */}
        <div className="bg-[#1b1b1b] p-8 text-center text-white border-b-4 border-[#ce2a34]">
          <CheckCircle size={64} className="mx-auto text-green-400 mb-4" />
          <h1 className="font-oswald text-3xl uppercase tracking-widest mb-2">
            Order Secured
          </h1>
          <p className="font-mono text-gray-300">Reference: #{shortRef}</p>
        </div>

        {/* Instructions & Payment Details */}
        <div className="p-8">
          <h2 className="font-oswald text-2xl text-[#1b1b1b] uppercase text-center mb-4 flex justify-center items-center gap-2">
            <Landmark size={24} className="text-[#ce2a34]" /> Action Required:
            Payment
          </h2>
          <p className="text-gray-600 text-center font-body mb-6">
            Your order has been saved. To complete your purchase and dispatch
            your items, please make a bank transfer to the account below.
          </p>

          <div className="bg-gray-50 p-6 rounded border border-gray-200 space-y-4 font-mono text-sm mb-8 shadow-inner">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-500 uppercase">Account Name</span>
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
              <span className="text-gray-500 uppercase">Account Number</span>
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
            <div className="flex justify-between items-center bg-[#ce2a34] text-white p-4 rounded mt-4 shadow-md">
              <span className="uppercase tracking-widest text-red-100">
                Reference:
              </span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">#{shortRef}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(shortRef, "ref")}
                  className="text-red-200 hover:text-white"
                >
                  {copied === "ref" ? "Copied!" : <Copy size={16} />}
                </button>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2 italic">
              *Please ensure you include the Reference Number so we can match
              your payment.
            </p>
          </div>

          <p className="text-center text-gray-500 font-body mb-8">
            We have also sent an email with your order summary and these payment
            instructions.
          </p>

          <Link
            to="/shop"
            className="w-full bg-[#1b1b1b] text-white py-4 rounded font-oswald uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-[#ce2a34] transition-colors shadow-md"
          >
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
