import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import {
  Loader,
  Eye,
  RefreshCw,
  CheckCircle,
  Truck,
  AlertTriangle,
  Clock,
  PackageCheck,
  Trash2,
  Edit,
  Save,
  XCircle
} from "lucide-react";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Tab state for filtering
  const [activeTab, setActiveTab] = useState("all");

  // Modal states
  const [trackingInput, setTrackingInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Set up edit data when a new order is selected or when entering edit mode
  useEffect(() => {
    if (selectedOrder) {
      setEditData({
        customer_name: selectedOrder.customer_name,
        customer_email: selectedOrder.customer_email,
        shipping_address: { ...selectedOrder.shipping_address }
      });
      setIsEditing(false); // Reset edit mode when switching orders
    }
  }, [selectedOrder]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setIsUpdating(true);
    try {
      const payload = { status: newStatus };
      if (newStatus === "shipped") payload.tracking_number = trackingInput;

      const { error } = await supabase
        .from("orders")
        .update(payload)
        .eq("id", orderId);
      if (error) throw error;

      // Automatically trigger email to customer!
      if (newStatus === "shipped" || newStatus === "processing") {
        await supabase.functions.invoke("send-email", {
          body: {
            email: selectedOrder.customer_email,
            name: selectedOrder.customer_name,
            orderId: selectedOrder.id,
            status: newStatus,
            trackingNumber: trackingInput || "N/A",
            items: selectedOrder.items,
          },
        });
      }

      await fetchOrders();
      setSelectedOrder(null);
      setTrackingInput("");
    } catch (err) {
      alert("Error updating order: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // NEW: Save Edited Details
  const handleSaveDetails = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          customer_name: editData.customer_name,
          customer_email: editData.customer_email,
          shipping_address: editData.shipping_address
        })
        .eq("id", selectedOrder.id);
      
      if (error) throw error;
      
      // Update local state to reflect changes instantly
      setSelectedOrder({
        ...selectedOrder,
        customer_name: editData.customer_name,
        customer_email: editData.customer_email,
        shipping_address: editData.shipping_address
      });
      
      setIsEditing(false);
      fetchOrders(); // Refresh table data in background
    } catch (err) {
      alert("Error saving details: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // NEW: Delete Order
  const handleDeleteOrder = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this order? This cannot be undone.")) {
      return;
    }
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", selectedOrder.id);
        
      if (error) throw error;
      
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      alert("Error deleting order: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditChange = (field, value, isAddress = false) => {
    if (isAddress) {
      setEditData({
        ...editData,
        shipping_address: { ...editData.shipping_address, [field]: value }
      });
    } else {
      setEditData({ ...editData, [field]: value });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-[10px] sm:text-xs font-bold uppercase">Pending</span>;
      case "processing":
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-[10px] sm:text-xs font-bold uppercase">Paid</span>;
      case "shipped":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-[10px] sm:text-xs font-bold uppercase">Shipped</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-[10px] sm:text-xs font-bold uppercase">{status}</span>;
    }
  };

  // FILTER LOGIC
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader className="animate-spin text-[#ce2a34]" size={32} />
      </div>
    );

  return (
    <div className="bg-white rounded shadow-sm border border-gray-200">
      <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50 gap-4">
        <h2 className="font-oswald text-xl md:text-2xl uppercase text-[#1b1b1b]">
          Order Management
        </h2>

        {/* TABS CONTROLS */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-xs font-bold uppercase rounded transition-colors ${activeTab === "all" ? "bg-[#1b1b1b] text-white" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"}`}
          >
            All Orders
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-1 px-4 py-2 text-xs font-bold uppercase rounded transition-colors ${activeTab === "pending" ? "bg-yellow-500 text-white" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"}`}
          >
            <Clock size={14} /> Pending
          </button>
          <button
            onClick={() => setActiveTab("processing")}
            className={`flex items-center gap-1 px-4 py-2 text-xs font-bold uppercase rounded transition-colors ${activeTab === "processing" ? "bg-blue-500 text-white" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"}`}
          >
            <CheckCircle size={14} /> Paid
          </button>
          <button
            onClick={() => setActiveTab("shipped")}
            className={`flex items-center gap-1 px-4 py-2 text-xs font-bold uppercase rounded transition-colors ${activeTab === "shipped" ? "bg-green-600 text-white" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"}`}
          >
            <PackageCheck size={14} /> Shipped
          </button>
        </div>

        <button
          onClick={fetchOrders}
          className="hidden md:flex items-center gap-2 text-xs md:text-sm font-mono text-gray-500 hover:text-[#ce2a34]"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* DESKTOP VIEW (Table) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left font-body">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="p-4 font-mono text-xs text-gray-500 uppercase">Order ID</th>
              <th className="p-4 font-mono text-xs text-gray-500 uppercase">Date</th>
              <th className="p-4 font-mono text-xs text-gray-500 uppercase">Customer</th>
              <th className="p-4 font-mono text-xs text-gray-500 uppercase">Total</th>
              <th className="p-4 font-mono text-xs text-gray-500 uppercase">Status</th>
              <th className="p-4 font-mono text-xs text-gray-500 uppercase text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 font-mono text-sm text-[#ce2a34] font-bold">
                  #{order.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="font-bold text-[#1b1b1b] text-sm">{order.customer_name}</div>
                  <div className="text-xs text-gray-500">{order.customer_email}</div>
                </td>
                <td className="p-4 font-oswald text-lg">
                  ${order.total_amount.toFixed(2)}
                </td>
                <td className="p-4">{getStatusBadge(order.status)}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-2 bg-[#1b1b1b] text-white px-3 py-1.5 rounded text-xs font-oswald uppercase tracking-widest hover:bg-[#ce2a34] transition-colors"
                  >
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No {activeTab !== "all" ? activeTab : ""} orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW (Card List) */}
      <div className="md:hidden flex flex-col">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="p-4 border-b border-gray-100 flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-[#ce2a34] font-bold">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              {getStatusBadge(order.status)}
            </div>
            <div>
              <div className="font-bold text-[#1b1b1b] text-sm">{order.customer_name}</div>
              <div className="text-xs text-gray-500">{order.customer_email}</div>
            </div>
            <div className="flex justify-between items-end mt-2">
              <div>
                <span className="text-xs text-gray-400 block mb-1">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
                <span className="font-oswald text-lg">
                  ${order.total_amount.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(order)}
                className="inline-flex items-center gap-2 bg-[#1b1b1b] text-white px-4 py-2 rounded text-xs font-oswald uppercase tracking-widest active:bg-[#ce2a34]"
              >
                <Eye size={14} /> Details
              </button>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No {activeTab !== "all" ? activeTab : ""} orders found.
          </div>
        )}
      </div>

      {/* FULL-SCREEN MOBILE / CENTERED DESKTOP MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/90 flex flex-col md:items-center md:justify-center p-0 md:p-4 z-50 backdrop-blur-sm">
          <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:w-full md:max-w-4xl md:rounded flex flex-col shadow-2xl relative">
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center bg-[#1b1b1b] text-white md:rounded-t shrink-0 sticky top-0 z-10">
              <div>
                <h3 className="font-oswald text-xl md:text-2xl uppercase tracking-widest leading-none">
                  Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </h3>
                <span className="text-xs text-gray-400 font-mono mt-1 block">
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white font-bold text-3xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 overflow-y-auto pb-24 md:pb-8">
              
              {/* Left Col (Customer Info & Proof) */}
              <div>
                <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-1">
                  <h4 className="font-oswald uppercase text-gray-400 text-sm">Customer Info</h4>
                  {isEditing && <span className="text-xs bg-blue-100 text-blue-700 px-2 rounded font-bold uppercase">Editing</span>}
                </div>

                {!isEditing ? (
                  // VIEW MODE
                  <>
                    <p className="font-bold text-[#1b1b1b]">{selectedOrder.customer_name}</p>
                    <p className="text-gray-600 text-sm mb-6">{selectedOrder.customer_email}</p>

                    <h4 className="font-oswald uppercase text-gray-400 text-sm mb-2 border-b border-gray-100 pb-1">Shipping Address</h4>
                    <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded border border-gray-200 font-mono">
                      <p className="font-bold text-[#1b1b1b] mb-1">{selectedOrder.shipping_address?.name}</p>
                      <p>{selectedOrder.shipping_address?.line1}</p>
                      <p>
                        {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} {selectedOrder.shipping_address?.postcode}
                      </p>
                      <p className="mt-2 text-gray-400">Ph: {selectedOrder.shipping_address?.phone}</p>
                    </div>
                  </>
                ) : (
                  // EDIT MODE
                  <div className="space-y-4 bg-blue-50/50 p-4 rounded border border-blue-100">
                    <div>
                      <label className="text-xs text-gray-500 font-bold uppercase">Full Name</label>
                      <input type="text" value={editData.customer_name} onChange={(e) => handleEditChange('customer_name', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-bold uppercase">Email</label>
                      <input type="email" value={editData.customer_email} onChange={(e) => handleEditChange('customer_email', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm" />
                    </div>
                    
                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <label className="text-xs text-gray-500 font-bold uppercase">Address Name</label>
                      <input type="text" value={editData.shipping_address?.name || ''} onChange={(e) => handleEditChange('name', e.target.value, true)} className="w-full p-2 border border-gray-300 rounded text-sm mb-2" />
                      
                      <label className="text-xs text-gray-500 font-bold uppercase">Street Address</label>
                      <input type="text" value={editData.shipping_address?.line1 || ''} onChange={(e) => handleEditChange('line1', e.target.value, true)} className="w-full p-2 border border-gray-300 rounded text-sm mb-2" />
                      
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="text-xs text-gray-500 font-bold uppercase">City</label>
                          <input type="text" value={editData.shipping_address?.city || ''} onChange={(e) => handleEditChange('city', e.target.value, true)} className="w-full p-2 border border-gray-300 rounded text-sm" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 font-bold uppercase">State</label>
                          <input type="text" value={editData.shipping_address?.state || ''} onChange={(e) => handleEditChange('state', e.target.value, true)} className="w-full p-2 border border-gray-300 rounded text-sm" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-500 font-bold uppercase">Postcode</label>
                          <input type="text" value={editData.shipping_address?.postcode || ''} onChange={(e) => handleEditChange('postcode', e.target.value, true)} className="w-full p-2 border border-gray-300 rounded text-sm" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 font-bold uppercase">Phone</label>
                          <input type="text" value={editData.shipping_address?.phone || ''} onChange={(e) => handleEditChange('phone', e.target.value, true)} className="w-full p-2 border border-gray-300 rounded text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <h4 className="font-oswald uppercase text-gray-400 text-sm mt-8 mb-2 border-b border-gray-100 pb-1">
                  Payment Proof
                </h4>
                {selectedOrder.receipt_url &&
                selectedOrder.receipt_url !== "No screenshot provided" ? (
                  <a
                    href={selectedOrder.receipt_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block relative group border border-gray-200 rounded p-1 w-full text-center bg-gray-50"
                  >
                    <img
                      src={selectedOrder.receipt_url}
                      alt="Receipt"
                      className="max-h-48 md:max-h-40 object-contain mx-auto"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                      <span className="text-white text-xs font-bold uppercase tracking-widest">
                        Click to Enlarge
                      </span>
                    </div>
                  </a>
                ) : (
                  <div className="bg-red-50 text-red-600 p-4 rounded text-sm flex items-center gap-2 border border-red-200 font-bold uppercase tracking-wide">
                    <AlertTriangle size={18} /> No Receipt Provided
                  </div>
                )}
              </div>

              {/* Right Col (Items & Actions) */}
              <div>
                <h4 className="font-oswald uppercase text-gray-400 text-sm mb-2 border-b border-gray-100 pb-1">
                  Items Ordered
                </h4>
                <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded border border-gray-200">
                  {selectedOrder.items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-sm border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <span className="font-bold text-[#1b1b1b]">{item.name}</span>
                        <span className="text-[#ce2a34] font-bold ml-2">x{item.quantity}</span>
                        {item.variant?.size_label && (
                          <p className="text-xs text-gray-500 font-mono mt-1">
                            {item.variant.size_label}
                          </p>
                        )}
                      </div>
                      <span className="font-mono font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-300 font-oswald uppercase text-lg">
                    <span>Total Paid</span>
                    <span className="text-[#ce2a34]">
                      ${selectedOrder.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <h4 className="font-oswald uppercase text-gray-400 text-sm mb-2 border-b border-gray-100 pb-1">
                  Action Center
                </h4>
                <div className="bg-white p-4 md:p-5 rounded border border-gray-200 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">Status:</span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>

                  {/* EDIT MODE TOGGLES */}
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-colors flex justify-center items-center gap-2 border border-gray-300"
                      >
                        <Edit size={14} /> Edit Details
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="flex-1 bg-gray-100 text-gray-600 py-2 rounded font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-colors flex justify-center items-center gap-1 border border-gray-300"
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                        <button 
                          onClick={handleSaveDetails}
                          disabled={isUpdating}
                          className="flex-1 bg-blue-600 text-white py-2 rounded font-bold uppercase text-xs tracking-widest hover:bg-blue-700 transition-colors flex justify-center items-center gap-1 shadow-sm"
                        >
                          {isUpdating ? <Loader className="animate-spin" size={14} /> : <><Save size={14} /> Save</>}
                        </button>
                      </>
                    )}
                  </div>

                  {/* APPROVE BUTTON */}
                  {selectedOrder.status === "pending" && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "processing")}
                      disabled={isUpdating}
                      className="w-full bg-[#1b1b1b] text-white py-4 md:py-3 rounded font-oswald uppercase tracking-widest text-sm hover:bg-[#3b82f6] transition-colors flex justify-center items-center gap-2 shadow-md active:scale-[0.98]"
                    >
                      {isUpdating ? <Loader className="animate-spin" size={18} /> : <><CheckCircle size={18} /> Approve Payment</>}
                    </button>
                  )}

                  {/* SHIP BUTTON */}
                  {selectedOrder.status === "processing" && (
                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
                        Tracking Number (AusPost)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. AP12345678"
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        className="w-full p-4 md:p-3 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:border-[#ce2a34]"
                      />
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, "shipped")}
                        disabled={isUpdating || !trackingInput}
                        className="w-full bg-[#ce2a34] text-white py-4 md:py-3 rounded font-oswald uppercase tracking-widest text-sm hover:bg-green-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 shadow-md active:scale-[0.98]"
                      >
                        {isUpdating ? <Loader className="animate-spin" size={18} /> : <><Truck size={18} /> Mark Shipped</>}
                      </button>
                    </div>
                  )}

                  {selectedOrder.status === "shipped" && (
                    <div className="bg-green-50 text-green-700 p-4 rounded text-sm text-center border border-green-200">
                      <CheckCircle size={24} className="mx-auto mb-2" />
                      <span className="font-bold uppercase tracking-widest block mb-1">Order Dispatched</span>
                      <span className="font-mono bg-white px-2 py-1 rounded border border-green-100 mt-2 inline-block break-all">
                        Trk: {selectedOrder.tracking_number || "N/A"}
                      </span>
                    </div>
                  )}

                  {/* DELETE BUTTON */}
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <button
                      onClick={handleDeleteOrder}
                      disabled={isUpdating}
                      className="w-full bg-red-50 text-red-600 border border-red-200 py-2 rounded font-bold uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-colors flex justify-center items-center gap-2"
                    >
                      <Trash2 size={14} /> Delete Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}