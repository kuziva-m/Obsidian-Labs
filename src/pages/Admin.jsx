import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import ProductManager from "../components/admin/ProductManager";
import { Lock, Package, LogOut, Loader2 } from "lucide-react";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
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
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[var(--brick-red)]" size={32} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-[var(--brick-red)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--baltic-sea)]">
              Obsidian Labs AU
            </h2>
            <p className="text-gray-500 mt-2">Admin Portal Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="admin@obsidianlabs.au"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[var(--brick-red)]"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[var(--brick-red)]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[var(--brick-red)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--old-brick)] transition-colors disabled:opacity-70"
            >
              {authLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--baltic-sea)] text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Obsidian Labs</h3>
          <p className="text-xs text-gray-400 mt-1">Management Console</p>
        </div>

        <nav className="flex-1 p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--brick-red)] text-white rounded-lg mb-2">
            <Package size={20} />
            <span className="font-medium">Products</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h2 className="text-xl font-bold text-[var(--baltic-sea)]">
            Products
          </h2>
          <button onClick={handleLogout} className="p-2 text-gray-600">
            <LogOut size={20} />
          </button>
        </div>
        <ProductManager />
      </main>
    </div>
  );
}
