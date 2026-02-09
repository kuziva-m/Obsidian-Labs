import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag, User } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[var(--baltic-sea)] text-white sticky top-0 z-50 shadow-md border-b border-gray-800">
      <div className="container-custom flex justify-between items-center h-20">
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* Logo Image */}
          <img
            src="/logo.png"
            alt="Obsidian Labs AU"
            className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
          {/* Text Brand */}
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight">
              OBSIDIAN LABS
            </span>
            <span className="text-[10px] text-gray-400 tracking-widest uppercase">
              Research Protocols
            </span>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-gray-300 hover:text-[var(--primary)] transition-colors"
          >
            HOME
          </Link>
          <Link
            to="/shop"
            className="text-sm font-medium text-gray-300 hover:text-[var(--primary)] transition-colors"
          >
            SHOP
          </Link>
          <Link
            to="/admin"
            className="text-sm font-medium text-gray-300 hover:text-[var(--primary)] transition-colors flex items-center gap-2"
          >
            <User size={16} /> ADMIN
          </Link>
          <Link
            to="/cart"
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
          >
            <ShoppingBag size={16} /> CART
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden p-2 text-gray-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-[var(--baltic-sea)] border-t border-gray-800 absolute w-full left-0">
          <div className="flex flex-col p-6 gap-4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-lg font-medium text-gray-300 hover:text-[var(--primary)]"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsOpen(false)}
              className="block text-lg font-medium text-gray-300 hover:text-[var(--primary)]"
            >
              Shop
            </Link>
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block text-lg font-medium text-gray-300 hover:text-[var(--primary)]"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
