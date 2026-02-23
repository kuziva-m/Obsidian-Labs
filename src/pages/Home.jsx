import Hero from "../components/home/Hero";
import HomeIntro from "../components/home/HomeIntro";
import HomeDetails from "../components/home/HomeDetails";
import Categories from "../components/home/Categories";
import HeroContent from "../components/home/HeroContent";
import Services from "../components/home/Services";
import HomeFAQ from "../components/home/HomeFAQ";
import HomeResearch from "../components/home/HomeResearch";
import Animations from "../components/home/Animations";
import Inventory from "../components/home/Inventory";
import SEO from "../components/SEO";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <SEO title="High-Purity Research Peptides Australia | Obsidian Labs" />
      <Hero />
      <HomeIntro /> {/* 1. High-Purity Intro */}
      <HomeDetails /> {/* 2. ADDED HERE: Trusted Supplier Text */}
      <HeroContent /> {/* 3. Priority Logistics (Icons) */}
      <Inventory />
      <Categories />
      <Services />
      <HomeFAQ />
      <HomeResearch />
      <Animations />
    </div>
  );
}
