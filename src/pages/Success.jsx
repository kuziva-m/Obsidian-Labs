import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import SEO from "../components/SEO";
import { CheckCircle, ArrowRight, Copy } from "lucide-react";

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError) {
        console.error("Error fetching order:", orderError);
        setLoading(false);
        return;
      }

      // FIX: Select 'size_label' from variants because 'size' doesn't exist in your schema
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select(
          `
          quantity,
          price_at_purchase,
          variants (
            size_label, 
            products (
              name,
              short_name,
              image_url
            )
          )
        `,
        )
        .eq("order_id", orderId);

      if (itemsError) console.error("Error fetching items:", itemsError);

      setOrder({ ...orderData, items: itemsData || [] });
      setLoading(false);
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ce2a34]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f4f5] p-4">
        <h1 className="font-[Oswald] text-3xl uppercase mb-4">
          Order Not Found
        </h1>
        <Link to="/" className="text-[#ce2a34] hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] py-20 px-4">
      <SEO title="Order Confirmed" />

      <div className="container mx-auto max-w-3xl pt-24">
        {/* SUCCESS HEADER */}
        <div className="bg-white p-8 rounded-t-md border-b border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ce2a34]/10 rounded-full mb-4">
                <CheckCircle size={32} className="text-[#ce2a34]" />
              </div>
              <h1 className="font-[Oswald] text-4xl uppercase text-[#1b1b1b] mb-1">
                Order Confirmed
              </h1>
              <p className="font-mono text-gray-500">
                Order #{order.id.slice(0, 8)}
              </p>
            </div>
            <div className="hidden md:block">
              <img
                src="/assets/obsidian-logo-red.png"
                alt="Obsidian Labs"
                className="w-40 h-auto object-contain opacity-90"
              />
            </div>
          </div>
        </div>

        {/* BANK DETAILS */}
        <div className="bg-[#1b1b1b] text-white p-8 shadow-md">
          <h2
            className="font-[Oswald] text-xl uppercase mb-6 flex items-center gap-2"
            style={{ color: "white" }}
          >
            <span className="w-2 h-2 bg-[#ce2a34] rounded-full"></span>
            Payment Required
          </h2>
          <p className="font-mono text-sm mb-6" style={{ color: "#e5e7eb" }}>
            Please make your payment to the account below. Your order will be
            dispatched immediately upon receipt of funds.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/5 rounded border border-white/10">
            <div>
              <div
                className="text-xs uppercase tracking-wider mb-1 font-bold"
                style={{ color: "white", opacity: 0.7 }}
              >
                Bank Name
              </div>
              <div className="font-bold text-lg" style={{ color: "white" }}>
                Obsidian Labs AU
              </div>
            </div>
            <div>
              <div
                className="text-xs uppercase tracking-wider mb-1 font-bold"
                style={{ color: "white", opacity: 0.7 }}
              >
                Total Amount
              </div>
              <div className="font-bold text-lg" style={{ color: "#ce2a34" }}>
                ${order.total_amount.toFixed(2)}
              </div>
            </div>
            <div>
              <div
                className="text-xs uppercase tracking-wider mb-1 font-bold"
                style={{ color: "white", opacity: 0.7 }}
              >
                BSB
              </div>
              <div className="font-mono text-lg" style={{ color: "white" }}>
                062-000
              </div>
            </div>
            <div>
              <div
                className="text-xs uppercase tracking-wider mb-1 font-bold"
                style={{ color: "white", opacity: 0.7 }}
              >
                Account Number
              </div>
              <div className="font-mono text-lg" style={{ color: "white" }}>
                1234 5678
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between bg-[#ce2a34]/10 p-4 rounded border border-[#ce2a34]/30">
            <div>
              <div
                className="text-xs uppercase tracking-wider font-bold mb-1"
                style={{ color: "#ce2a34" }}
              >
                Payment Reference
              </div>
              <div
                className="font-mono text-xl font-bold"
                style={{ color: "white" }}
              >
                #{order.id.slice(0, 8)}
              </div>
            </div>
            <Copy
              size={20}
              className="text-[#ce2a34] cursor-pointer hover:text-white transition-colors"
            />
          </div>
        </div>

        {/* ORDER ITEMS LIST */}
        <div className="bg-white p-8 rounded-b-md shadow-sm border-t border-gray-100">
          <h3 className="font-[Oswald] text-xl uppercase text-[#1b1b1b] mb-6">
            Order Details
          </h3>

          <div className="space-y-4">
            {order.items.map((item, index) => {
              const product = item.variants?.products;
              // FIX: Use 'size_label' from the fetched variant data
              const size = item.variants?.size_label || "Standard";

              return (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {product?.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-bold">
                          IMG
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-[Oswald] text-lg uppercase leading-none text-[#1b1b1b]">
                        {product?.name || "Unknown Item"}
                      </div>
                      {/* FIXED: Display Size Label */}
                      <div className="font-mono text-xs text-gray-500 mt-1 uppercase tracking-wide">
                        <span className="font-bold text-[#ce2a34]">{size}</span>{" "}
                        • Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-[#1b1b1b]">
                    ${(item.price_at_purchase * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200">
            <div className="flex justify-between mb-2 font-mono text-sm text-gray-500">
              <span>Shipping</span>
              <span>${order.shipping_cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-[Oswald] text-xl uppercase text-[#1b1b1b]">
                Total
              </span>
              <span className="font-[Oswald] text-2xl font-bold text-[#ce2a34]">
                ${order.total_amount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#1b1b1b] hover:text-[#ce2a34] font-[Oswald] uppercase tracking-wider transition-colors"
            >
              Continue Shopping <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
