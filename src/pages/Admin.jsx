import { useState } from "react";
import OrderManager from "../components/admin/OrderManager";
import SEO from "../components/SEO";
import { PackageSearch, LogOut } from "lucide-react";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // You can change this passcode to whatever you want!
    if (passcode === "obsidian2026") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid Passcode");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-4">
        <SEO title="Admin Login - Obsidian Labs" />
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded shadow-md w-full max-w-sm border-t-4 border-[#ce2a34]"
        >
          <h2 className="font-oswald text-2xl uppercase text-[#1b1b1b] mb-6 text-center">
            Admin Portal
          </h2>
          <input
            type="password"
            placeholder="Enter Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 font-body focus:outline-none focus:border-[#ce2a34]"
          />
          <button
            type="submit"
            className="w-full bg-[#1b1b1b] text-white font-oswald uppercase tracking-widest py-3 rounded hover:bg-[#ce2a34] transition-colors"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] flex flex-col md:flex-row">
      <SEO title="Admin Dashboard - Obsidian Labs" />

      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#1b1b1b] text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-800">
          <h2 className="font-oswald text-2xl uppercase tracking-widest text-[#ce2a34]">
            Obsidian
          </h2>
          <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">
            Command Center
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 bg-[#ce2a34] text-white p-3 rounded font-oswald uppercase tracking-widest text-sm shadow-md">
            <PackageSearch size={18} /> Orders
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 text-gray-400 hover:text-white p-3 font-oswald uppercase tracking-widest text-sm transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <OrderManager />
        </div>
      </div>
    </div>
  );
}
