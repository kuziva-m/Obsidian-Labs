import { Routes, Route, useLocation } from "react-router-dom"; // Import useLocation
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Assuming you have this
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation(); // Get current route

  // Define routes where the Footer (and maybe Navbar) should be HIDDEN
  const hideLayoutRoutes = ["/admin", "/success"];

  // Check if the current path starts with any of the hidden routes
  const isHiddenRoute = hideLayoutRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Conditionally Render Navbar (Optional: Keep it if you want Navbar on Admin) */}
      {!isHiddenRoute && <Navbar />}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Conditionally Render Footer */}
      {!isHiddenRoute && <Footer />}
    </div>
  );
}

export default App;
