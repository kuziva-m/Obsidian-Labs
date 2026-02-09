import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Admin from "./pages/Admin";

// Create a simple placeholder Navbar to navigate
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ background: "var(--baltic-sea)", padding: "1rem" }}>
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">
          Obsidian Labs AU
        </Link>
        <div className="flex gap-4">
          <Link to="/shop" className="text-gray-300 hover:text-white">
            Shop
          </Link>
          <Link to="/admin" className="text-gray-300 hover:text-white">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
