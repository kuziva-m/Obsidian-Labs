import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";
import { ArrowRight, Shield, Beaker, Syringe } from "lucide-react";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    async function fetchFeatured() {
      // Fetch products and their variants
      const { data: allProducts } = await supabase
        .from("products")
        .select(`*, variants (*)`)
        .limit(4); // Simple limit for now, you can add logic to pick specific ones later

      if (allProducts) setFeaturedProducts(allProducts);
    }
    fetchFeatured();
  }, []);

  return (
    <div>
      <SEO title="Home" description="Premium Peptides for Research." />

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Premium Research Peptides</h1>
          <p style={styles.heroSubtitle}>
            99% Purity Guaranteed. Lab Tested. Fast Shipping.
          </p>
          <Link to="/shop" className="btn-primary">
            Shop Now
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Featured Products</h2>
            <Link to="/shop" style={styles.link}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div style={styles.grid}>
            {featuredProducts.length > 0 ? (
              featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              <p>Loading products...</p>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ ...styles.section, backgroundColor: "#fff" }}>
        <div className="container">
          <h2 style={{ ...styles.sectionTitle, textAlign: "center" }}>
            Browse Categories
          </h2>
          <div style={styles.catGrid}>
            <Link to="/shop?category=Peptides" style={styles.catCard}>
              <Beaker size={40} color="var(--brick-red)" />
              <h3 style={styles.catTitle}>Peptides</h3>
            </Link>
            <Link to="/shop?category=Peptide Blends" style={styles.catCard}>
              <Shield size={40} color="var(--brick-red)" />
              <h3 style={styles.catTitle}>Blends</h3>
            </Link>
            <Link to="/shop?category=Accessories" style={styles.catCard}>
              <Syringe size={40} color="var(--brick-red)" />
              <h3 style={styles.catTitle}>Accessories</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    backgroundColor: "var(--baltic-sea)",
    color: "white",
    padding: "100px 0",
    textAlign: "center",
    backgroundImage:
      "linear-gradient(rgba(34,32,35,0.9), rgba(34,32,35,0.7)), url('/hero-banner.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  heroTitle: { fontSize: "3rem", marginBottom: "1rem", color: "white" },
  heroSubtitle: { fontSize: "1.2rem", color: "#cbd5e1", marginBottom: "2rem" },
  section: { padding: "80px 0" },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  sectionTitle: { fontSize: "2rem", color: "var(--baltic-sea)", margin: 0 },
  link: {
    color: "var(--brick-red)",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "30px",
  },
  catGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginTop: "40px",
    flexWrap: "wrap",
  },
  catCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "200px",
    height: "180px",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    textDecoration: "none",
    color: "var(--baltic-sea)",
    transition: "0.2s",
    backgroundColor: "white",
  },
  catTitle: { marginTop: "15px", fontSize: "1.1rem" },
};
