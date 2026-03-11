import { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useCart } from "../lib/CartContext";
import { CheckCircle, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  // Get the order ID from internal state instead of the URL
  const orderId = location.state?.orderId;
  const shortRef = orderId ? orderId.slice(0, 8).toUpperCase() : "";

  useEffect(() => {
    // If someone tries to visit /success directly without buying anything, send them home
    if (!orderId) {
      navigate("/");
      return;
    }

    clearCart();
    window.scrollTo(0, 0);
  }, [orderId, navigate, clearCart]);

  if (!orderId) return null;

  return (
    <div className="bg-[#f4f4f5] min-h-screen py-16 px-4 flex items-center justify-center">
      <SEO title="Order Received - Obsidian Labs" />

      <div className="max-w-lg w-full bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 text-center">
        
        {/* Header Section */}
        <div className="bg-[#1b1b1b] p-10 text-white border-b-4 border-[#ce2a34]">
          <CheckCircle size={72} className="mx-auto text-green-400 mb-6" />
          <h1 className="font-oswald text-4xl uppercase tracking-widest mb-3">
            Order Secured
          </h1>
          <p className="font-mono text-gray-300 text-lg">Reference: #{shortRef}</p>
        </div>

        {/* Message Section */}
        <div className="p-10">
          <h2 className="font-oswald text-2xl text-[#1b1b1b] uppercase mb-4">
            Thank You
          </h2>
          
          <div className="text-gray-600 font-body space-y-4 mb-10 text-justify md:text-center leading-relaxed">
            <p>
              We have successfully received your order and payment confirmation screenshot. 
            </p>
            <p>
              Our team will verify the transfer and begin processing your items immediately. You will receive an email notification containing your Australia Post tracking number as soon as your package has been dispatched from our Melbourne facility.
            </p>
          </div>

          <Link
            to="/products"
            className="w-full bg-[#1b1b1b] text-white py-4 rounded font-oswald uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-[#ce2a34] transition-colors shadow-md"
          >
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}