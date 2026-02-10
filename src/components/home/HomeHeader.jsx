import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import "./HomeHeader.css";

export default function HomeHeader() {
  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <Link className="brand" to="/">
          <img
            className="brand__logo"
            src="/assets/obsidian-logo-red.png"
            alt="Obsidian Labs"
          />
          <div className="brand__text">
            <div className="brand__name">OBSIDIAN</div>
            <div className="brand__sub">LABS</div>
          </div>
        </Link>

        <nav className="nav">
          <Link className="nav__link" to="/about">
            About Us
          </Link>
          <Link className="nav__link" to="/shop">
            Services
          </Link>
          <Link className="nav__link" to="/contact">
            Contact
          </Link>
        </nav>

        <div className="topbar__actions">
          <button className="iconBtn" aria-label="Search">
            <Search size={18} />
          </button>
          <Link className="btn btn--primary" to="/contact">
            Request Consultation
          </Link>
        </div>
      </div>
    </header>
  );
}
