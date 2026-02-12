import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../lib/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container mx-auto nav-inner">
        {/* --- LOGO (LEFT) --- */}
        <Link to="/" className="nav-logo-wrapper" onClick={closeMenu}>
          <img
            src="/assets/obsidian-logo-red.png"
            alt="Obsidian Labs"
            className="nav-logo"
          />
          <div className="nav-brand-text">
            <span className="brand-main">OBSIDIAN</span>
            <span className="brand-sub">LABS</span>
          </div>
        </Link>

        {/* --- DESKTOP LINKS (CENTER) --- */}
        <div className="nav-links-desktop">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/shop" className="nav-link">
            Shop
          </Link>
          <Link to="/research-divisions" className="nav-link">
            Divisions
          </Link>
          <Link to="/research" className="nav-link">
            Library
          </Link>
          <Link to="/faq" className="nav-link">
            FAQ
          </Link>
        </div>

        {/* --- ACTIONS (RIGHT) --- */}
        <div className="nav-actions">
          {/* CART BUTTON */}
          <button
            className="nav-cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Cart"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* MOBILE HAMBURGER (Visible only on mobile) */}
          <button
            className="nav-mobile-toggle"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "is-open" : ""}`}>
        <div className="mobile-menu-inner">
          <Link to="/" className="mobile-link" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/shop" className="mobile-link" onClick={closeMenu}>
            Shop
          </Link>
          <Link
            to="/research-divisions"
            className="mobile-link"
            onClick={closeMenu}
          >
            Divisions
          </Link>
          <Link to="/research" className="mobile-link" onClick={closeMenu}>
            Library
          </Link>
          <Link to="/faq" className="mobile-link" onClick={closeMenu}>
            FAQ
          </Link>
        </div>
      </div>
    </nav>
  );
}
