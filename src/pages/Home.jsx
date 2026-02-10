import SEO from "../components/SEO";
import HomeHeader from "../components/home/HomeHeader";
import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import Inventory from "../components/home/Inventory";
import Footer from "../components/Footer";
import "./Home.css"; // Imports the animation styles

export default function Home() {
  return (
    <div className="bg-[#f0f4f8] overflow-x-hidden">
      <SEO title="Home" />

      {/* 1. Nav (Reusing the new component) */}
      <HomeHeader />

      {/* 2. Hero (Restored Brutalist Style) */}
      <Hero />

      {/* 3. Categories (Restored Middle Section) */}
      <Categories />

      {/* 4. Inventory (Restored Tilt Cards) */}
      <Inventory />

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
