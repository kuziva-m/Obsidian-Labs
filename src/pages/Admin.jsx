import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import ProductManager from "../components/admin/ProductManager";
import OrderManager from "../components/admin/OrderManager";
import {
  Package,
  ShoppingCart,
  LogOut,
  Loader2,
  ArrowRight,
} from "lucide-react";
import SEO from "../components/SEO";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [currentView, setCurrentView] = useState("orders");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4f4f5]">
        <Loader2 className="animate-spin text-[#ce2a34]" size={32} />
      </div>
    );
  }

  // --- STYLED LOGIN SCREEN ---
  if (!session) {
    return (
      <div className="min-h-screen flex w-full bg-white">
        <SEO title="Admin Portal - Obsidian Labs" />
        {/* LEFT SIDE: Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-20 relative z-10">
          <div className="max-w-md w-full mx-auto">
            {/* Logo Section */}
            <div className="mb-12">
              <img
                src="/assets/obsidian-logo-red.png"
                alt="Obsidian Labs"
                className="h-12 w-auto mb-6"
              />
              <h1 className="font-oswald text-4xl uppercase text-[#1b1b1b] mb-2 tracking-wide">
                Admin Portal
              </h1>
              <p className="text-gray-500 font-mono text-sm">
                Secure access for authorized personnel only.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="admin@obsidianlabs.au"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-l-4 border-gray-300 focus:border-[#ce2a34] outline-none transition-all font-mono text-gray-900 placeholder-gray-400 rounded-r-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 bg-gray-50 border-l-4 border-gray-300 focus:border-[#ce2a34] outline-none transition-all font-mono text-gray-900 placeholder-gray-400 rounded-r-md"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="group w-full bg-[#ce2a34] text-white py-4 px-6 rounded-md font-oswald uppercase tracking-widest text-lg hover:bg-[#1b1b1b] transition-all duration-300 flex items-center justify-between disabled:opacity-70 disabled:cursor-not-allowed mt-8"
              >
                <span>{authLoading ? "Authenticating..." : "Sign In"}</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE: Stylistic Image (Hidden on Mobile) */}
        <div className="hidden lg:block w-1/2 bg-[#1b1b1b] relative overflow-hidden">
          {/* Abstract Tech Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")',
            }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b] via-transparent to-[#1b1b1b] opacity-90"></div>

          <div className="absolute bottom-20 left-12 right-12 text-white z-20">
            <h2 className="font-oswald text-5xl uppercase leading-tight mb-4">
              Master Control
              <br />
              Program
            </h2>
            <div className="h-1 w-20 bg-[#ce2a34] mb-6"></div>
            <p className="font-mono text-gray-400 max-w-md">
              Manage inventory, track shipments, and oversee operations from a
              centralized command center.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD SCREEN ---
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SEO title="Dashboard - Obsidian Labs" />
      {/* SIDEBAR (Desktop) */}
      <aside className="w-64 bg-[#1b1b1b] text-white flex flex-col hidden md:flex h-screen sticky top-0 border-r border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <img
            src="/assets/obsidian-logo-red.png"
            alt="Logo"
            className="h-6 w-auto mb-3 opacity-90"
          />
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            Command Center
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button
            onClick={() => setCurrentView("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all border border-transparent ${
              currentView === "orders"
                ? "bg-[#ce2a34] text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5 hover:border-gray-700"
            }`}
          >
            <ShoppingCart size={18} />
            <span className="font-oswald uppercase tracking-wide text-sm">
              Orders
            </span>
          </button>

          <button
            onClick={() => setCurrentView("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all border border-transparent ${
              currentView === "products"
                ? "bg-[#ce2a34] text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5 hover:border-gray-700"
            }`}
          >
            <Package size={18} />
            <span className="font-oswald uppercase tracking-wide text-sm">
              Products
            </span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-[#ce2a34] transition-colors text-sm font-mono"
          >
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen relative">
        {/* MOBILE HEADER */}
        <div className="flex justify-between items-center mb-6 md:hidden sticky top-0 bg-gray-50 z-20 py-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src="/assets/obsidian-logo-red.png"
              alt="Logo"
              className="h-8 w-auto"
            />
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-[#ce2a34]"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* MOBILE TABS */}
        <div className="flex gap-2 mb-6 md:hidden">
          <button
            onClick={() => setCurrentView("orders")}
            className={`flex-1 py-3 text-xs font-bold uppercase rounded border transition-colors ${
              currentView === "orders"
                ? "bg-[#1b1b1b] text-white border-[#1b1b1b]"
                : "bg-white text-gray-500 border-gray-200"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setCurrentView("products")}
            className={`flex-1 py-3 text-xs font-bold uppercase rounded border transition-colors ${
              currentView === "products"
                ? "bg-[#1b1b1b] text-white border-[#1b1b1b]"
                : "bg-white text-gray-500 border-gray-200"
            }`}
          >
            Products
          </button>
        </div>

        {currentView === "orders" ? <OrderManager /> : <ProductManager />}
      </main>
    </div>
  );
}
