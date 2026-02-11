import Hero from "../components/home/Hero";
import Categories from "../components/home/Categories";
import HeroContent from "../components/home/HeroContent";
import Services from "../components/home/Services";
import Animations from "../components/home/Animations";
import SEO from "../components/SEO";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <SEO title="Home - Obsidian Labs" />
      <Hero />
      <HeroContent />
      <Categories />
      <Services />
      <Animations />
    </div>
  );
}
