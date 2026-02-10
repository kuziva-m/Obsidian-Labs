import SEO from "../components/SEO";
// REMOVED: import HomeHeader from "../components/home/HomeHeader";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import Inventory from "../components/home/Inventory"; // or Services.jsx if that's what you renamed it to
import Footer from "../components/Footer";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container bg-[#f4f4f5] overflow-x-hidden">
      <SEO title="Home - Obsidian Labs" />

      {/* 1. HERO SECTION (Brutalist & Precision) */}
      <Hero />

      {/* 2. CATEGORIES (Oswald Headings + Mono Details) */}
      <Categories />

      {/* 3. INVENTORY PREVIEW (Shop Listings) */}
      <Inventory />

      {/* 4. FOOTER */}
      <Footer />
    </div>
  );
}
