import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useCart } from "../lib/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { cart, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container mx-auto nav-top-bar">
        {/* MOBILE MENU TOGGLE */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* LOGO IMAGE */}
        <Link to="/" className="nav-logo-wrapper">
          <img
            src="/assets/obsidian-logo-red.png"
            alt="Obsidian Labs"
            className="nav-logo-img"
          />
        </Link>

        {/* SEARCH BAR (DESKTOP) */}
        <div className="search-widget">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="SEARCH PEPTIDES & ACCESSORIES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="search-input-header font-mono"
          />
        </div>

        {/* ACTIONS (CART) */}
        <div className="nav-actions">
          <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={26} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="cart-count-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      <div className="mobile-search-wrapper">
        <div className="mobile-search-inner">
          <Search size={18} className="mobile-search-icon" />
          <input
            type="text"
            placeholder="SEARCH PEPTIDES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="mobile-search-input font-mono"
          />
        </div>
        {searchQuery && (
          <button className="mobile-cancel-btn" onClick={handleClearSearch}>
            <X size={24} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* BOTTOM LINKS */}
      <div
        className={`nav-bottom-bar ${isMobileMenuOpen ? "mobile-open" : ""}`}
      >
        <div className="nav-links-container">
          <Link
            to="/"
            className="nav-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="nav-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Shop All
          </Link>
          <Link
            to="/about"
            className="nav-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About Us
          </Link>
        </div>
      </div>
    </nav>
  );
}
