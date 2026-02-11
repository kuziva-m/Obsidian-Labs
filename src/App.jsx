import { Routes, Route, useLocation } from "react-router-dom";
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

function App() {
  const location = useLocation();

  const hideLayoutRoutes = ["/admin", "/success"];

  const isHiddenRoute = hideLayoutRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  return (
    <div className="flex flex-col min-h-screen">
      <AgeVerification /> {/* Add this here */}
      <CartDrawer />
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
          <Route path="*" element={<NotFound />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </div>
      {!isHiddenRoute && <Footer />}
    </div>
  );
}

export default App;
