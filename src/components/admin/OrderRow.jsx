import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { ChevronDown, ChevronUp, Package, Truck, Check } from "lucide-react";

export default function OrderRow({ order, onUpdate, showToast }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- STATUS TOGGLE LOGIC ---
  const handleStatusUpdate = async (newStatus) => {
    if (!confirm(`Are you sure you want to mark this order as ${newStatus}?`))
      return;

    setLoading(true);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order.id);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Failed to update status");
    } else {
      showToast(`Order marked as ${newStatus}`);
      onUpdate(); // Refresh the parent list
    }
  };

  // Determine what button to show based on current status
  const renderActionButtons = () => {
    if (loading)
      return <span className="text-gray-400 text-sm">Updating...</span>;

    switch (order.status) {
      case "on_hold":
        return (
          <button
            onClick={() => handleStatusUpdate("paid")}
            className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-bold uppercase hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Check size={14} /> Confirm Payment
          </button>
        );
      case "paid":
        return (
          <button
            onClick={() => handleStatusUpdate("shipped")}
            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-bold uppercase hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Truck size={14} /> Mark Shipped
          </button>
        );
      case "shipped":
        return (
          <button
            onClick={() => handleStatusUpdate("delivered")}
            className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm font-bold uppercase hover:bg-gray-900 transition-colors"
          >
            Mark Delivered
          </button>
        );
      default:
        return (
          <span className="text-gray-400 text-xs uppercase font-bold">
            Completed
          </span>
        );
    }
  };

  // Helper for status badge color
  const getStatusColor = (s) => {
    switch (s) {
      case "on_hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md mb-3 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* --- MAIN ROW --- */}
      <div className="p-4 flex items-center justify-between gap-4">
        {/* Left: ID & Customer */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-xs text-gray-400">
              #{order.id.slice(0, 8)}
            </span>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusColor(order.status)}`}
            >
              {order.status.replace("_", " ")}
            </span>
          </div>
          <h4 className="font-bold text-[#1b1b1b]">{order.customer_name}</h4>
          <p className="text-sm text-gray-500">{order.customer_email}</p>
        </div>

        {/* Middle: Amount & Date */}
        <div className="text-right hidden md:block">
          <div className="font-bold text-[#ce2a34] text-lg">
            ${order.total_amount.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">
            {new Date(order.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {renderActionButtons()}

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* --- EXPANDED DETAILS (Items) --- */}
      {expanded && (
        <div className="bg-gray-50 p-4 border-t border-gray-100">
          <h5 className="text-xs font-bold uppercase text-gray-400 mb-3">
            Order Items
          </h5>
          <div className="space-y-2">
            {order.order_items &&
              order.order_items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden">
                      {/* Safe check for image */}
                      {item.variants?.products?.image_url && (
                        <img
                          src={item.variants.products.image_url}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">
                        {item.variants?.products?.name || "Unknown Item"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-sm">
                    ${item.price_at_purchase}
                  </div>
                </div>
              ))}
          </div>

          {/* Shipping Address Display */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-xs font-bold uppercase text-gray-400 mb-2">
              Shipping Address
            </h5>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">
              {order.shipping_address?.address},{" "}
              {order.shipping_address?.suburb} {order.shipping_address?.state}{" "}
              {order.shipping_address?.postcode}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
