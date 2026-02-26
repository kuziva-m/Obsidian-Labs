import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../lib/CartContext";
import { supabase } from "../lib/supabase";
import {
  CheckCircle,
  ArrowRight,
  Landmark,
  Copy,
  ShoppingBag,
  Loader,
  Upload,
  AlertTriangle,
} from "lucide-react";
import SEO from "../components/SEO";

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { clearCart } = useCart();

  const [copied, setCopied] = useState("");
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  // Upload States
  const [receiptFile, setReceiptFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const shortRef = orderId ? orderId.slice(0, 8).toUpperCase() : "";

  // 1. Clear cart and scroll to top ONCE on mount
  useEffect(() => {
    clearCart();
    window.scrollTo(0, 0);
  }, []);

  // 2. Fetch order details to show summary
  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoadingOrder(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (error) throw error;
        setOrder(data);

        // If they already uploaded a receipt (e.g. they refresh the page), show the success state
        if (data.receipt_url && data.receipt_url !== "No screenshot provided") {
          setUploadSuccess(true);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoadingOrder(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  const getVariantLabel = (item) => {
    if (item.variants && item.variants.length > 0)
      return item.variants[0].size_label;
    if (item.sizeLabel) return item.sizeLabel;
    if (item.variant && item.variant.size_label) return item.variant.size_label;
    return "";
  };

  // --- UPLOAD LOGIC ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadError(null);
      setUploadSuccess(false);
    }
  };

  const handleUploadSubmit = async () => {
    if (!receiptFile || !orderId) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      const fileExt = receiptFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      // 1. Upload the Receipt Image
      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(fileName, receiptFile);

      if (uploadError)
        throw new Error(
          "Failed to upload receipt. Please ensure it is a valid image.",
        );

      // 2. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(fileName);

      const receiptUrl = publicUrlData.publicUrl;

      // 3. Update the Order in the Database
      const { error: updateError } = await supabase
        .from("orders")
        .update({ receipt_url: receiptUrl })
        .eq("id", orderId);

      if (updateError) throw updateError;

      setUploadSuccess(true);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError(
        err.message || "Failed to upload receipt. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
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

            {order && (
              <div className="pt-4 mt-2 border-t border-gray-200 flex justify-between items-center">
                <span className="text-gray-500 uppercase">
                  Total to Transfer
                </span>
                <span className="font-bold text-[#1b1b1b] text-lg">
                  ${Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            )}

            <p className="text-xs text-center text-gray-500 mt-2 italic">
              *Please ensure you include the Reference Number so we can match
              your payment.
            </p>
          </div>

          {/* --- UPLOAD PROOF SECTION --- */}
          <div className="mb-8 border border-gray-200 rounded overflow-hidden shadow-sm">
            <h3 className="bg-gray-100 font-oswald text-lg uppercase text-[#1b1b1b] p-4 flex items-center gap-2 border-b border-gray-200">
              <Upload size={18} className="text-[#ce2a34]" /> Payment Proof
            </h3>

            <div className="p-5 bg-white">
              {uploadSuccess ? (
                <div className="bg-green-50 text-green-700 p-4 rounded text-sm flex items-center gap-3 border border-green-200 font-bold uppercase tracking-wide">
                  <CheckCircle size={24} /> Receipt Successfully Uploaded!
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-sm mb-4 font-body">
                    Once you have made the transfer, upload a screenshot of your
                    receipt here to speed up the dispatch process.
                  </p>

                  {uploadError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 flex items-center gap-2 border border-red-200">
                      <AlertTriangle size={16} /> {uploadError}
                    </div>
                  )}

                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${previewUrl ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
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
                          className="max-h-32 rounded shadow-sm border border-green-200 mb-2"
                        />
                        <p className="text-xs text-gray-500 font-mono">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Upload
                          size={28}
                          className="text-gray-400 mx-auto mb-2"
                        />
                        <p className="font-oswald uppercase text-[#1b1b1b]">
                          Select Screenshot
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Tap or drag an image here
                        </p>
                      </div>
                    )}
                  </div>

                  {previewUrl && (
                    <button
                      onClick={handleUploadSubmit}
                      disabled={isUploading}
                      className="mt-4 w-full bg-[#1b1b1b] text-white py-3 rounded font-oswald uppercase tracking-widest text-sm hover:bg-[#ce2a34] transition-colors flex justify-center items-center gap-2 shadow-md active:scale-95"
                    >
                      {isUploading ? (
                        <Loader className="animate-spin" size={16} />
                      ) : (
                        "Submit Receipt"
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* --- ORDER SUMMARY SECTION --- */}
          <div className="mb-8 border border-gray-200 rounded overflow-hidden">
            <h3 className="bg-gray-100 font-oswald text-lg uppercase text-[#1b1b1b] p-4 flex items-center gap-2 border-b border-gray-200">
              <ShoppingBag size={18} className="text-[#ce2a34]" /> Order Summary
            </h3>

            <div className="p-4 bg-white">
              {loadingOrder ? (
                <div className="flex justify-center items-center py-6 text-gray-400">
                  <Loader size={24} className="animate-spin mr-2" /> Loading
                  details...
                </div>
              ) : order && order.items ? (
                <>
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
                    {order.items.map((item, i) => {
                      const safeVariant = getVariantLabel(item);
                      return (
                        <div
                          key={i}
                          className="flex justify-between items-center text-sm border-b border-gray-50 pb-3"
                        >
                          <div className="flex-1">
                            <p className="font-bold text-[#1b1b1b]">
                              {item.name}
                            </p>
                            {safeVariant && (
                              <p className="text-gray-500 font-mono text-xs">
                                {safeVariant}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-gray-500 text-xs mb-1">
                              Qty: {item.quantity}
                            </p>
                            <p className="font-bold text-[#1b1b1b]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-gray-100 pt-3 space-y-2 font-mono text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping (Express)</span>
                      <span>
                        {order.shipping_cost === 0
                          ? "Free"
                          : `$${Number(order.shipping_cost).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#1b1b1b] font-bold text-base pt-2 border-t border-gray-100">
                      <span className="font-oswald uppercase tracking-wide">
                        Total
                      </span>
                      <span className="text-[#ce2a34]">
                        ${Number(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 py-4 font-mono text-sm">
                  Could not load order details.
                </p>
              )}
            </div>
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
