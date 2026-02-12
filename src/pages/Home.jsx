import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import HeroContent from "../components/home/HeroContent";
import Services from "../components/home/Services";
import HomeFAQ from "../components/home/HomeFAQ";
import HomeResearch from "../components/home/HomeResearch"; // IMPORTED
import Animations from "../components/home/Animations";
import Inventory from "../components/home/Inventory";
import SEO from "../components/SEO";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <SEO title="Home - Obsidian Labs" />
      <Hero />
      <HeroContent />
      <Inventory />
      <Categories />
      <Services />
      <HomeFAQ />
      <HomeResearch /> {/* ADDED HERE */}
      <Animations />
    </div>
  );
}
