import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabase";
import { styles } from "./OrderManagerStyles";
import OrderRow from "./OrderRow";
import { Search, CheckCircle, RefreshCw } from "lucide-react";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("on_hold");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *, 
        order_items (
          quantity, 
          price_at_purchase, 
          variants (products (name, image_url))
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching orders:", error);
    else setOrders(data || []);
    setLoading(false);
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- FILTERING LOGIC ---
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const s = search.toLowerCase();
      const matchesSearch =
        order.id.toLowerCase().includes(s) ||
        order.customer_email?.toLowerCase().includes(s) ||
        order.customer_name?.toLowerCase().includes(s);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  // --- STATS LOGIC ---
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, o) => sum + (o.total_amount || 0),
      0,
    );
    const actionNeededCount = orders.filter(
      (o) => o.status === "on_hold" || o.status === "paid",
    ).length;

    return {
      totalRevenue,
      actionNeededCount,
      totalOrders: orders.length,
    };
  }, [orders]);

  const tabs = [
    { id: "all", label: "All" },
    { id: "on_hold", label: "On Hold" },
    { id: "paid", label: "Paid" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
  ];

  return (
    <div style={{ position: "relative", padding: "20px" }}>
      {/* STATS BAR */}
      <div style={styles.statsContainer}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Total Revenue</span>
          <span style={styles.statValue}>${stats.totalRevenue.toFixed(2)}</span>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Action Required</span>
          <span
            style={{
              ...styles.statValue,
              color: stats.actionNeededCount > 0 ? "#ce2a34" : "inherit",
            }}
          >
            {stats.actionNeededCount}
          </span>
        </div>
        <div style={styles.statDivider} />
        <button
          onClick={fetchOrders}
          style={{
            ...styles.exportBtn,
            background: "transparent",
            color: "#666",
            border: "1px solid #ddd",
          }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* TOOLBAR */}
      <div style={styles.toolbar}>
        <div style={styles.filterGroup}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                ...styles.filterBtn,
                background: statusFilter === tab.id ? "#1b1b1b" : "white",
                color: statusFilter === tab.id ? "white" : "#64748b",
                borderColor: statusFilter === tab.id ? "#1b1b1b" : "#e2e8f0",
                fontWeight: statusFilter === tab.id ? "bold" : "normal",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={styles.searchWrapper}>
          <Search size={16} color="#94a3b8" style={{ marginRight: "8px" }} />
          <input
            placeholder="Search ID, Name, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.inputReset}
          />
        </div>
      </div>

      {/* TABLE */}
      <div style={styles.tableContainer}>
        {loading ? (
          <div style={styles.emptyState}>Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div style={styles.emptyState}>No orders found.</div>
        ) : (
          filteredOrders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onUpdate={fetchOrders}
              showToast={showToast}
            />
          ))
        )}
      </div>

      {notification && (
        <div style={styles.toast}>
          <CheckCircle size={16} /> {notification}
        </div>
      )}
    </div>
  );
}
