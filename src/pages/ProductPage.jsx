import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useCart } from "../lib/CartContext";
import {
  Loader2,
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Truck,
  FlaskConical,
} from "lucide-react";
import SEO from "../components/SEO";

export default function ProductPage() {
  const { slug } = useParams(); // This is the product ID passed from Shop.jsx
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProductData() {
      setLoading(true);

      // Fetch product and its variants in one go
      const { data, error } = await supabase
        .from("products")
        .select(`*, variants(*)`)
        .eq("id", slug)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
        setVariants(data.variants || []);
        // Default to the first variant (usually the lowest strength/price)
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      }
      setLoading(false);
    }

    fetchProductData();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    // We pass a modified product object to the cart that includes the selected variant's price and size
    const productWithVariant = {
      ...product,
      name: `${product.name} (${selectedVariant.size_label})`,
      price: parseFloat(selectedVariant.price),
      variantId: selectedVariant.id,
      // Overwrite variants array to ensure the cart calculates price based on THIS selection
      variants: [selectedVariant],
    };

    addToCart(productWithVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-[#ce2a34]" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
        <h1 className="font-[Oswald] text-3xl mb-4 text-gray-500 uppercase tracking-widest">
          Product Not Found
        </h1>
        <Link
          to="/shop"
          className="text-[#ce2a34] font-mono hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      <SEO title={`${product.name} - Obsidian Labs`} />

      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ce2a34] transition-colors mb-12 font-mono text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Inventory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* --- LEFT: PRODUCT IMAGE --- */}
          <div className="relative group">
            <div className="aspect-square bg-[#121212] border border-[#27272a] rounded-xl overflow-hidden flex items-center justify-center shadow-2xl">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-gray-700">
                  <FlaskConical size={64} strokeWidth={1} />
                  <span className="font-[Oswald] text-xl opacity-50 uppercase tracking-widest">
                    No Image Available
                  </span>
                </div>
              )}
            </div>
            {/* Status Badge */}
            <div className="absolute top-6 left-6">
              <span
                className={`px-4 py-2 rounded-md font-bold text-xs uppercase tracking-widest border ${
                  product.in_stock
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}
              >
                {product.in_stock ? "Available" : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* --- RIGHT: PRODUCT INFO --- */}
          <div className="flex flex-col">
            <span className="text-[#ce2a34] font-mono text-sm tracking-[0.3em] uppercase mb-2">
              {product.category}
            </span>
            <h1 className="font-[Oswald] text-5xl md:text-6xl uppercase leading-tight mb-4 tracking-tight">
              {product.name}
            </h1>
            <div className="h-1 w-24 bg-[#ce2a34] mb-8"></div>

            <div className="text-4xl font-[Oswald] text-white mb-8 flex items-baseline gap-2">
              <span className="text-gray-500 text-2xl font-mono">$</span>
              {selectedVariant ? selectedVariant.price : "0.00"}
              <span className="text-gray-500 text-sm font-mono uppercase ml-2 tracking-widest">
                AUD
              </span>
            </div>

            <p className="text-gray-400 text-lg leading-relaxed mb-10 font-light max-w-xl">
              {product.description ||
                "Research-grade compound manufactured to the highest purity standards. Intended strictly for laboratory research use."}
            </p>

            {/* STRENGTH / SIZE SELECTOR */}
            {variants.length > 1 && (
              <div className="mb-10">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
                  Select Strength
                </label>
                <div className="flex flex-wrap gap-3">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-6 py-3 border rounded-lg font-[Oswald] uppercase tracking-widest text-sm transition-all duration-300 ${
                        selectedVariant?.id === v.id
                          ? "bg-[#ce2a34] border-[#ce2a34] text-white shadow-[0_0_20px_rgba(206,42,52,0.3)]"
                          : "bg-transparent border-[#27272a] text-gray-500 hover:border-gray-400 hover:text-white"
                      }`}
                    >
                      {v.size_label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`group relative w-full md:w-auto px-12 py-5 rounded-lg font-[Oswald] uppercase tracking-[0.2em] text-lg transition-all flex items-center justify-center gap-4 ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-white text-black hover:bg-[#ce2a34] hover:text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ShoppingCart
                size={20}
                className={added ? "animate-bounce" : ""}
              />
              <span>
                {added
                  ? "Item Added"
                  : product.in_stock
                    ? "Add to Research"
                    : "Sold Out"}
              </span>
            </button>

            {/* TRUST BADGES */}
            <div className="mt-12 pt-12 border-t border-[#27272a] grid grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <ShieldCheck className="text-[#ce2a34] shrink-0" size={24} />
                <div>
                  <h4 className="font-[Oswald] uppercase text-sm tracking-widest mb-1">
                    Purity Verified
                  </h4>
                  <p className="text-xs text-gray-500 font-mono">
                    99%+ HPLC Analysis
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Truck className="text-[#ce2a34] shrink-0" size={24} />
                <div>
                  <h4 className="font-[Oswald] uppercase text-sm tracking-widest mb-1">
                    Discreet Logistics
                  </h4>
                  <p className="text-xs text-gray-500 font-mono">
                    Secure Express Shipping
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
