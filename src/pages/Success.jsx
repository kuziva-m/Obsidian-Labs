import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShieldCheck, Loader } from "lucide-react";
import { useCart } from "../lib/CartContext";
import SEO from "../components/SEO";

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [loading, setLoading] = useState(true);

  const { cart, clearCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Clear cart on success
    if (cart && cart.length > 0 && clearCart) {
      clearCart();
    }
    // Simulate slight loading for feel
    setTimeout(() => setLoading(false), 1200);
  }, [cart, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] flex flex-col items-center justify-center">
        <Loader className="animate-spin text-[#ce2a34] mb-4" size={48} />
        <h3 className="font-oswald uppercase text-xl text-[#1b1b1b] tracking-widest">
          Securing Order...
        </h3>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f4f5] min-h-[80vh] flex flex-col items-center justify-center p-4">
      <SEO title="Order Received - Obsidian Labs" />

      <div className="bg-white p-10 md:p-16 max-w-xl w-full text-center rounded-sm shadow-xl border-t-4 border-[#ce2a34]">
        <div className="inline-flex items-center justify-center p-4 bg-red-50 rounded-full mb-6">
          <ShieldCheck size={64} className="text-[#ce2a34]" />
        </div>

        <h1 className="font-oswald text-4xl uppercase text-[#1b1b1b] mb-4">
          Order Under Review
        </h1>

        <p className="font-body text-gray-600 text-lg leading-relaxed mb-8">
          Thank you! Your order and payment proof have been securely submitted.
          Our team is currently reviewing your payment. You will receive an
          email confirmation once your order is cleared for dispatch.
        </p>

        {orderId && (
          <div className="bg-[#1b1b1b] p-6 rounded-sm mb-8 text-white">
            <p className="font-mono text-sm text-gray-400 uppercase tracking-widest mb-1">
              Order Reference
            </p>
            <h2 className="font-oswald text-3xl tracking-widest text-[#ce2a34]">
              #{orderId.slice(0, 8).toUpperCase()}
            </h2>
          </div>
        )}

        <Link
          to="/shop"
          className="inline-block bg-[#1b1b1b] text-white font-oswald uppercase tracking-widest py-4 px-8 border-2 border-[#1b1b1b] hover:bg-white hover:text-[#1b1b1b] transition-colors"
        >
          Return to Catalog
        </Link>
      </div>
    </div>
  );
}
