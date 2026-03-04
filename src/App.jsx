import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react"; // <-- IMPORTED useEffect
import AgeVerification from "./components/AgeVerification";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import CartDrawer from "./components/CartDrawer";
import FAQ from "./pages/FAQ";
import ResearchLibrary from "./pages/ResearchLibrary";
import ResearchDivisions from "./pages/ResearchDivisions";
import InstagramButton from "./components/InstagramButton";
import Terms from "./pages/Terms";
import Quality from "./pages/Quality";
import RefundPolicy from "./pages/RefundPolicy";
import Contact from "./pages/Contact"; // <-- NEW IMPORT

function App() {
  const location = useLocation();

  // --- META PIXEL PAGEVIEW TRACKING ---
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [location]);

  const hideLayoutRoutes = ["/admin", "/success"];

  const isHiddenRoute = hideLayoutRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  return (
    <div className="flex flex-col min-h-screen">
      <AgeVerification />
      <CartDrawer />
      <InstagramButton />
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
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/research" element={<ResearchLibrary />} />
          <Route path="/research-divisions" element={<ResearchDivisions />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/contact" element={<Contact />} /> {/* <-- NEW ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isHiddenRoute && <Footer />}
    </div>
  );
}

export default App;
