import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../lib/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { cart, setIsCartOpen } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="container mx-auto nav-top-bar">
        {/* LOGO (Left) */}
        <Link to="/" className="nav-logo-wrapper">
          <img
            src="/assets/obsidian-logo-red.png"
            alt="Obsidian Labs"
            className="nav-logo-img"
          />
        </Link>

        {/* NAVIGATION LINKS (Center) */}
        <div className="nav-links-center">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/shop" className="nav-link">
            Shop
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
        </div>

        {/* ACTIONS (Right) */}
        <div className="nav-actions">
          <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={32} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="cart-count-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
