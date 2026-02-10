import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop"; // Ensure this component exists, or remove this line

// Page Imports
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Admin from "./pages/Admin";
import Project from "./pages/Project"; // <--- NEW PAGE

// Note: We removed the global <Navbar /> here because
// Home and Project pages now have their own specific headers.
// You should add <HomeHeader /> to Shop and Admin if you want the header there too.

function App() {
  return (
    <Router>
      {/* ScrollToTop ensures page starts at top when navigating */}
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/project" element={<Project />} />
      </Routes>
    </Router>
  );
}

export default App;
