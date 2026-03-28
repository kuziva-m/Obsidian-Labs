import { useState, useEffect, useMemo } from "react";
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
  XCircle,
  Search,
  ArrowDownUp,
  DollarSign,
  TrendingUp,
  Filter,
  Calendar,
  MapPin,
  Star,
  UserCheck,
  Box,
  X,
} from "lucide-react";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- CORE SEARCH & SORT STATES ---
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  // --- ADVANCED FILTER STATES ---
  const [showFilters, setShowFilters] = useState(false);
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [filterProduct, setFilterProduct] = useState("all");
  const [filterVIP, setFilterVIP] = useState(false);
  const [filterCustomerType, setFilterCustomerType] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [filterUnfilled, setFilterUnfilled] = useState(false);

  // Modal states
  const [trackingInput, setTrackingInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
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

  useEffect(() => {
    if (selectedOrder) {
      setEditData({
        customer_name: selectedOrder.customer_name,
        customer_email: selectedOrder.customer_email,
        shipping_address: { ...selectedOrder.shipping_address },
      });
      setIsEditing(false);
    }
  }, [selectedOrder]);

  // --- ACTIONS ---
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

  const handleSaveDetails = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          customer_name: editData.customer_name,
          customer_email: editData.customer_email,
          shipping_address: editData.shipping_address,
        })
        .eq("id", selectedOrder.id);

      if (error) throw error;

      setSelectedOrder({
        ...selectedOrder,
        customer_name: editData.customer_name,
        customer_email: editData.customer_email,
        shipping_address: editData.shipping_address,
      });

      setIsEditing(false);
      fetchOrders();
    } catch (err) {
      alert("Error saving details: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (
      !window.confirm("Are you sure you want to permanently delete this order?")
    )
      return;
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
        shipping_address: { ...editData.shipping_address, [field]: value },
      });
    } else {
      setEditData({ ...editData, [field]: value });
    }
  };

  const resetFilters = () => {
    setFilterDateRange("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setFilterProduct("all");
    setFilterVIP(false);
    setFilterCustomerType("all");
    setFilterState("all");
    setFilterUnfilled(false);
    setSearchQuery("");
  };

  // --- HELPERS ---
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-[10px] sm:text-xs font-bold uppercase">
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-[10px] sm:text-xs font-bold uppercase">
            Paid
          </span>
        );
      case "shipped":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-[10px] sm:text-xs font-bold uppercase">
            Shipped
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-[10px] sm:text-xs font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  const getVariantLabel = (item) => {
    if (item.variants && item.variants.length > 0)
      return item.variants[0].size_label;
    if (item.sizeLabel) return item.sizeLabel;
    if (item.variant && item.variant.size_label) return item.variant.size_label;
    return "";
  };

  // --- DYNAMIC FILTER DATA EXTRACTION ---
  const { uniqueProducts, uniqueStates, customerOrderCounts } = useMemo(() => {
    const products = new Set();
    const states = new Set();
    const emailCounts = {};

    orders.forEach((order) => {
      // Products
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => products.add(item.name));
      }
      // States
      if (order.shipping_address?.state) {
        states.add(order.shipping_address.state.toUpperCase());
      }
      // Customer Loyalty
      if (order.customer_email) {
        emailCounts[order.customer_email] =
          (emailCounts[order.customer_email] || 0) + 1;
      }
    });

    return {
      uniqueProducts: Array.from(products).sort(),
      uniqueStates: Array.from(states).sort(),
      customerOrderCounts: emailCounts,
    };
  }, [orders]);

  // --- METRICS CALCULATION ---
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.total_amount || 0),
      0,
    );
    const pendingCount = orders.filter((o) => o.status === "pending").length;
    return {
      revenue: totalRevenue,
      orders: orders.length,
      pending: pendingCount,
    };
  }, [orders]);

  // --- MASTER FILTER & SORT LOGIC ---
  const processedOrders = useMemo(() => {
    let result = orders;

    // 1. Tab Filter
    if (activeTab !== "all")
      result = result.filter((o) => o.status === activeTab);

    // 2. Text Search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.customer_name?.toLowerCase().includes(query) ||
          o.customer_email?.toLowerCase().includes(query) ||
          o.id?.toLowerCase().includes(query),
      );
    }

    // 3. Time Filter
    if (filterDateRange !== "all") {
      const now = new Date();
      result = result.filter((o) => {
        const orderDate = new Date(o.created_at);
        if (filterDateRange === "this_month") {
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        }
        if (filterDateRange === "last_month") {
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          return (
            orderDate.getMonth() === lastMonth.getMonth() &&
            orderDate.getFullYear() === lastMonth.getFullYear()
          );
        }
        if (filterDateRange === "last_90") {
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(now.getDate() - 90);
          return orderDate >= ninetyDaysAgo;
        }
        if (filterDateRange === "custom" && customStartDate && customEndDate) {
          const start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          return orderDate >= start && orderDate <= end;
        }
        return true;
      });
    }

    // 4. Product Filter
    if (filterProduct !== "all") {
      result = result.filter((o) =>
        o.items?.some((item) => item.name === filterProduct),
      );
    }

    // 5. VIP Filter (> $500)
    if (filterVIP) {
      result = result.filter((o) => o.total_amount >= 500);
    }

    // 6. Customer Type (New vs Returning)
    if (filterCustomerType !== "all") {
      result = result.filter((o) => {
        const isReturning = customerOrderCounts[o.customer_email] > 1;
        return filterCustomerType === "returning" ? isReturning : !isReturning;
      });
    }

    // 7. State/Location Filter
    if (filterState !== "all") {
      result = result.filter(
        (o) => o.shipping_address?.state?.toUpperCase() === filterState,
      );
    }

    // 8. Unfilled/Needs Tracking Filter
    if (filterUnfilled) {
      result = result.filter(
        (o) =>
          o.status === "processing" &&
          (!o.tracking_number || o.tracking_number === ""),
      );
    }

    // 9. Sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return new Date(b.created_at) - new Date(a.created_at);
        case "date_asc":
          return new Date(a.created_at) - new Date(b.created_at);
        case "total_desc":
          return b.total_amount - a.total_amount;
        case "total_asc":
          return a.total_amount - b.total_amount;
        default:
          return 0;
      }
    });

    return result;
  }, [
    orders,
    activeTab,
    searchQuery,
    sortBy,
    filterDateRange,
    customStartDate,
    customEndDate,
    filterProduct,
    filterVIP,
    filterCustomerType,
    filterState,
    filterUnfilled,
    customerOrderCounts,
  ]);

  const activeFilterCount = [
    filterDateRange !== "all",
    filterProduct !== "all",
    filterVIP,
    filterCustomerType !== "all",
    filterState !== "all",
    filterUnfilled,
  ].filter(Boolean).length;

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader className="animate-spin text-[#ce2a34]" size={32} />
      </div>
    );

  return (
    <div className="space-y-6 pb-10">
      {/* QUICK METRICS DASHBOARD */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-full text-green-600 border border-green-100">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Lifetime Revenue
            </p>
            <p className="font-oswald text-2xl text-[#1b1b1b]">
              ${metrics.revenue.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-full text-blue-600 border border-blue-100">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Total Orders
            </p>
            <p className="font-oswald text-2xl text-[#1b1b1b]">
              {metrics.orders}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="bg-yellow-50 p-3 rounded-full text-yellow-600 border border-yellow-100">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Action Required
            </p>
            <p className="font-oswald text-2xl text-[#1b1b1b]">
              {metrics.pending} Pending
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50 space-y-5">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="font-oswald text-xl md:text-2xl uppercase text-[#1b1b1b]">
              Order Management
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-colors border ${showFilters || activeFilterCount > 0 ? "bg-[#ce2a34] text-white border-[#ce2a34]" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"}`}
              >
                <Filter size={16} />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              <button
                onClick={fetchOrders}
                className="hidden md:flex items-center gap-2 text-xs md:text-sm font-mono text-gray-500 hover:text-[#ce2a34] bg-white px-3 py-2 border border-gray-300 rounded"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* ADVANCED FILTERS PANEL */}
          {showFilters && (
            <div className="bg-white p-5 rounded border border-gray-200 shadow-inner grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-200 relative">
              <button
                onClick={resetFilters}
                className="absolute top-4 right-4 text-xs font-bold uppercase text-gray-400 hover:text-[#ce2a34] flex items-center gap-1"
              >
                <X size={14} /> Clear All
              </button>

              {/* Time Range */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Calendar size={14} className="text-[#ce2a34]" /> Date Range
                </label>
                <select
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-[#1b1b1b]"
                >
                  <option value="all">All Time</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="last_90">Last 90 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
                {filterDateRange === "custom" && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-1/2 p-2 border border-gray-300 rounded text-xs text-gray-600"
                    />
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-1/2 p-2 border border-gray-300 rounded text-xs text-gray-600"
                    />
                  </div>
                )}
              </div>

              {/* Compound Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Box size={14} className="text-[#ce2a34]" /> Filter by
                  Compound
                </label>
                <select
                  value={filterProduct}
                  onChange={(e) => setFilterProduct(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-[#1b1b1b]"
                >
                  <option value="all">All Products</option>
                  {uniqueProducts.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  <MapPin size={14} className="text-[#ce2a34]" /> Delivery State
                </label>
                <select
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-[#1b1b1b]"
                >
                  <option value="all">All States</option>
                  {uniqueStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Loyalty / VIP */}
              <div className="space-y-3 lg:col-span-2 bg-gray-50 p-3 rounded border border-gray-100">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  <UserCheck size={14} className="text-[#ce2a34]" /> Customer
                  Insights
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700">
                    <input
                      type="radio"
                      name="custType"
                      checked={filterCustomerType === "all"}
                      onChange={() => setFilterCustomerType("all")}
                      className="accent-[#ce2a34]"
                    />{" "}
                    All
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700">
                    <input
                      type="radio"
                      name="custType"
                      checked={filterCustomerType === "new"}
                      onChange={() => setFilterCustomerType("new")}
                      className="accent-[#ce2a34]"
                    />{" "}
                    New Customers
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700">
                    <input
                      type="radio"
                      name="custType"
                      checked={filterCustomerType === "returning"}
                      onChange={() => setFilterCustomerType("returning")}
                      className="accent-[#ce2a34]"
                    />{" "}
                    Returning Regulars
                  </label>
                </div>
              </div>

              {/* Actionable Toggles */}
              <div className="space-y-3 bg-gray-50 p-3 rounded border border-gray-100">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Star size={14} className="text-[#ce2a34]" /> High Priority
                </label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      checked={filterVIP}
                      onChange={(e) => setFilterVIP(e.target.checked)}
                      className="accent-[#ce2a34] w-4 h-4 rounded"
                    />
                    VIP Orders (&gt;$500)
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700">
                    <input
                      type="checkbox"
                      checked={filterUnfilled}
                      onChange={(e) => setFilterUnfilled(e.target.checked)}
                      className="accent-[#ce2a34] w-4 h-4 rounded"
                    />
                    Awaiting Fulfillment (Needs Tracking)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* BASIC CONTROLS: SEARCH, SORT, TABS */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* TABS */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-xs font-bold uppercase rounded transition-colors ${activeTab === "all" ? "bg-[#1b1b1b] text-white" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"}`}
              >
                All
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

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* SEARCH BAR */}
              <div className="relative w-full sm:w-64">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search name, email, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded font-body focus:outline-none focus:border-[#1b1b1b] transition-colors"
                />
              </div>

              {/* SORT DROPDOWN */}
              <div className="relative w-full sm:w-48 flex-shrink-0">
                <ArrowDownUp
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded font-body text-gray-700 bg-white focus:outline-none focus:border-[#1b1b1b] appearance-none cursor-pointer"
                >
                  <option value="date_desc">Date: Newest First</option>
                  <option value="date_asc">Date: Oldest First</option>
                  <option value="total_desc">Total: High to Low</option>
                  <option value="total_asc">Total: Low to High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP VIEW (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left font-body">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="p-4 font-mono text-xs text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="p-4 font-mono text-xs text-gray-500 uppercase">
                  Date
                </th>
                <th className="p-4 font-mono text-xs text-gray-500 uppercase">
                  Customer
                </th>
                <th className="p-4 font-mono text-xs text-gray-500 uppercase">
                  Location
                </th>
                <th className="p-4 font-mono text-xs text-gray-500 uppercase">
                  Total
                </th>
                <th className="p-4 font-mono text-xs text-gray-500 uppercase">
                  Status
                </th>
                <th className="p-4 font-mono text-xs text-gray-500 uppercase text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {processedOrders.map((order) => {
                const isReturning =
                  customerOrderCounts[order.customer_email] > 1;
                return (
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
                      <div className="font-bold text-[#1b1b1b] text-sm flex items-center gap-2">
                        {order.customer_name}
                        {isReturning && (
                          <span
                            title="Returning Customer"
                            className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-widest"
                          >
                            VIP
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customer_email}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-bold text-gray-500">
                      {order.shipping_address?.state?.toUpperCase() || "N/A"}
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
                );
              })}
              {processedOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-10 text-center text-gray-500 bg-gray-50 font-mono text-sm uppercase"
                  >
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW (Card List) */}
        <div className="md:hidden flex flex-col">
          {processedOrders.map((order) => {
            const isReturning = customerOrderCounts[order.customer_email] > 1;
            return (
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
                  <div className="font-bold text-[#1b1b1b] text-sm flex items-center gap-2">
                    {order.customer_name}
                    {isReturning && (
                      <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-widest">
                        VIP
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.customer_email}
                  </div>
                  <div className="text-xs font-bold text-gray-400 mt-1">
                    State:{" "}
                    {order.shipping_address?.state?.toUpperCase() || "N/A"}
                  </div>
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
            );
          })}
          {processedOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500 font-mono text-sm uppercase bg-gray-50">
              No orders match filters.
            </div>
          )}
        </div>

        {/* FULL-SCREEN MOBILE / CENTERED DESKTOP MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/90 flex flex-col md:items-center md:justify-center p-0 md:p-4 z-50 backdrop-blur-sm">
            <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:w-full md:max-w-4xl md:rounded flex flex-col shadow-2xl relative">
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

              <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 overflow-y-auto pb-24 md:pb-8">
                {/* Left Col (Customer Info & Proof) */}
                <div>
                  <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-1">
                    <h4 className="font-oswald uppercase text-gray-400 text-sm">
                      Customer Info
                    </h4>
                    {isEditing && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 rounded font-bold uppercase">
                        Editing
                      </span>
                    )}
                  </div>

                  {!isEditing ? (
                    <>
                      <p className="font-bold text-[#1b1b1b]">
                        {selectedOrder.customer_name}
                      </p>
                      <p className="text-gray-600 text-sm mb-6">
                        {selectedOrder.customer_email}
                      </p>

                      <h4 className="font-oswald uppercase text-gray-400 text-sm mb-2 border-b border-gray-100 pb-1">
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded border border-gray-200 font-mono">
                        <p className="font-bold text-[#1b1b1b] mb-1">
                          {selectedOrder.shipping_address?.name}
                        </p>
                        <p>{selectedOrder.shipping_address?.line1}</p>
                        <p>
                          {selectedOrder.shipping_address?.city},{" "}
                          {selectedOrder.shipping_address?.state}{" "}
                          {selectedOrder.shipping_address?.postcode}
                        </p>
                        <p className="mt-2 text-gray-400">
                          Ph: {selectedOrder.shipping_address?.phone}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4 bg-blue-50/50 p-4 rounded border border-blue-100">
                      <div>
                        <label className="text-xs text-gray-500 font-bold uppercase">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editData.customer_name}
                          onChange={(e) =>
                            handleEditChange("customer_name", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-bold uppercase">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editData.customer_email}
                          onChange={(e) =>
                            handleEditChange("customer_email", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-200">
                        <label className="text-xs text-gray-500 font-bold uppercase">
                          Address Name
                        </label>
                        <input
                          type="text"
                          value={editData.shipping_address?.name || ""}
                          onChange={(e) =>
                            handleEditChange("name", e.target.value, true)
                          }
                          className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                        />
                        <label className="text-xs text-gray-500 font-bold uppercase">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={editData.shipping_address?.line1 || ""}
                          onChange={(e) =>
                            handleEditChange("line1", e.target.value, true)
                          }
                          className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                        />
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <label className="text-xs text-gray-500 font-bold uppercase">
                              City
                            </label>
                            <input
                              type="text"
                              value={editData.shipping_address?.city || ""}
                              onChange={(e) =>
                                handleEditChange("city", e.target.value, true)
                              }
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 font-bold uppercase">
                              State
                            </label>
                            <input
                              type="text"
                              value={editData.shipping_address?.state || ""}
                              onChange={(e) =>
                                handleEditChange("state", e.target.value, true)
                              }
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500 font-bold uppercase">
                              Postcode
                            </label>
                            <input
                              type="text"
                              value={editData.shipping_address?.postcode || ""}
                              onChange={(e) =>
                                handleEditChange(
                                  "postcode",
                                  e.target.value,
                                  true,
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 font-bold uppercase">
                              Phone
                            </label>
                            <input
                              type="text"
                              value={editData.shipping_address?.phone || ""}
                              onChange={(e) =>
                                handleEditChange("phone", e.target.value, true)
                              }
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                            />
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
                    {selectedOrder.items?.map((item, i) => {
                      const safeVariant = getVariantLabel(item);
                      return (
                        <div
                          key={i}
                          className="flex justify-between items-center text-sm border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                        >
                          <div>
                            <span className="font-bold text-[#1b1b1b]">
                              {item.name}
                            </span>
                            <span className="text-[#ce2a34] font-bold ml-2">
                              x{item.quantity}
                            </span>
                            {safeVariant && (
                              <p className="text-xs text-gray-500 font-mono mt-1">
                                {safeVariant}
                              </p>
                            )}
                          </div>
                          <span className="font-mono font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
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
                      <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">
                        Status:
                      </span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>

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
                            {isUpdating ? (
                              <Loader className="animate-spin" size={14} />
                            ) : (
                              <>
                                <Save size={14} /> Save
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>

                    {selectedOrder.status === "pending" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(selectedOrder.id, "processing")
                        }
                        disabled={isUpdating}
                        className="w-full bg-[#1b1b1b] text-white py-4 md:py-3 rounded font-oswald uppercase tracking-widest text-sm hover:bg-[#3b82f6] transition-colors flex justify-center items-center gap-2 shadow-md active:scale-[0.98]"
                      >
                        {isUpdating ? (
                          <Loader className="animate-spin" size={18} />
                        ) : (
                          <>
                            <CheckCircle size={18} /> Approve Payment
                          </>
                        )}
                      </button>
                    )}

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
                          onClick={() =>
                            handleUpdateStatus(selectedOrder.id, "shipped")
                          }
                          disabled={isUpdating || !trackingInput}
                          className="w-full bg-[#ce2a34] text-white py-4 md:py-3 rounded font-oswald uppercase tracking-widest text-sm hover:bg-green-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 shadow-md active:scale-[0.98]"
                        >
                          {isUpdating ? (
                            <Loader className="animate-spin" size={18} />
                          ) : (
                            <>
                              <Truck size={18} /> Mark Shipped
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {selectedOrder.status === "shipped" && (
                      <div className="bg-green-50 text-green-700 p-4 rounded text-sm text-center border border-green-200">
                        <CheckCircle size={24} className="mx-auto mb-2" />
                        <span className="font-bold uppercase tracking-widest block mb-1">
                          Order Dispatched
                        </span>
                        <span className="font-mono bg-white px-2 py-1 rounded border border-green-100 mt-2 inline-block break-all">
                          Trk: {selectedOrder.tracking_number || "N/A"}
                        </span>
                      </div>
                    )}

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
    </div>
  );
}
