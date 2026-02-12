import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero-wrapper">
      <div className="hero-content-container">
        <img src="/assets/hero-bg.jpeg" alt="Hero" className="hero-bg-img" />

        {/* --- DESKTOP BUTTON (Hidden on Mobile) --- */}
        <Link to="/shop" className="hotspot-desktop">
          <span className="sr-only">Shop Now</span>
        </Link>

        {/* --- MOBILE BUTTON (Hidden on Desktop) --- */}
        <Link to="/shop" className="hotspot-mobile">
          <span className="sr-only">Shop Now</span>
        </Link>
      </div>
    </section>
  );
}
