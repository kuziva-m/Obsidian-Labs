import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";
import { LayoutGrid, FlaskConical, Layers, Syringe } from "lucide-react";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeCategory = searchParams.get("category") || "All";

  const categories = [
    { name: "All", icon: <LayoutGrid size={18} /> },
    { name: "Peptides", icon: <FlaskConical size={18} /> },
    { name: "Peptide Blends", icon: <Layers size={18} /> },
    { name: "Accessories", icon: <Syringe size={18} /> },
  ];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase.from("products").select(`*, variants (*)`);

      if (activeCategory !== "All") {
        query = query.eq("category", activeCategory);
      }

      const { data } = await query;
      if (data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, [activeCategory]);

  return (
    <div style={{ padding: "40px 0" }}>
      <SEO title="Shop" description="Browse our catalog." />
      <div className="container">
        <h1
          style={{
            color: "var(--baltic-sea)",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          Shop Peptides
        </h1>

        {/* Category Tabs */}
        <div style={styles.tabs}>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSearchParams({ category: cat.name })}
              style={
                activeCategory === cat.name ? styles.tabActive : styles.tab
              }
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div style={styles.grid}>
          {loading ? (
            <p>Loading...</p>
          ) : products.length > 0 ? (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p>No products found in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  tabs: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "40px",
    flexWrap: "wrap",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    borderRadius: "50px",
    border: "1px solid var(--border)",
    background: "white",
    color: "var(--salt-box)",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  tabActive: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    borderRadius: "50px",
    border: "1px solid var(--baltic-sea)",
    background: "var(--baltic-sea)",
    color: "white",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
};
