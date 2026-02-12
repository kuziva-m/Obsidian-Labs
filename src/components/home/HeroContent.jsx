import { Link } from "react-router-dom";
import {
  Truck,
  Package,
  MapPin,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import "./HeroContent.css";

export default function HeroContent() {
  return (
    <section className="shipping-hero-section">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="shipping-bg-layer">
        <Truck className="ship-icon pos-a" size={140} strokeWidth={1} />
        <Package className="ship-icon pos-b" size={100} strokeWidth={1} />
        <MapPin className="ship-icon pos-c" size={120} strokeWidth={1} />
        <ShieldCheck className="ship-icon pos-d" size={80} strokeWidth={1} />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="shipping-content-box">
          {/* TOP TAG */}
          <div className="shipping-priority-tag">
            <Zap size={14} fill="white" />
            <span>PRIORITY LOGISTICS</span>
          </div>

          {/* MAIN TITLES */}
          <h1 className="shipping-main-title">
            AUSTRALIA WIDE <br />
            <span className="text-red-accent">EXPRESS DISPATCH</span>
          </h1>

          {/* PRICING DATA */}
          <div className="shipping-data-row">
            <div className="shipping-data-card">
              <span className="data-label">FLAT RATE</span>
              <span className="data-value">$15</span>
              <span className="data-sub">EXPRESS POST</span>
            </div>

            <div className="shipping-data-divider"></div>

            <div className="shipping-data-card">
              <span className="data-label">ORDER BONUS</span>
              <span className="data-value">FREE</span>
              <span className="data-sub">OVER $249 AUD</span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="shipping-summary-text">
            Every order is dispatched from our Melbourne facility within 24
            business hours. We utilize secure, discreet packaging and Australia
            Post Express to ensure your research materials arrive safely and
            swiftly.
          </p>

          {/* ACTION BUTTONS */}
          <div className="shipping-action-group">
            <Link to="/shop" className="ship-btn-primary">
              Access Inventory
            </Link>
            <Link to="/faq" className="ship-btn-secondary">
              Shipping Policy <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
