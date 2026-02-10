import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useCart } from "../lib/CartContext";
import SEO from "../components/SEO";
import {
  LayoutGrid,
  FlaskConical,
  Layers,
  Syringe,
  ShoppingCart,
  Check,
} from "lucide-react";
import "./Shop.css";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get active category from URL or default to "All"
  const activeCategory = searchParams.get("category") || "All";

  const categories = [
    { name: "All", icon: <LayoutGrid size={18} /> },
    { name: "Peptides", icon: <FlaskConical size={18} /> },
    { name: "Peptide Blends", icon: <Layers size={18} /> },
    { name: "Accessories", icon: <Syringe size={18} /> },
  ];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase.from("products").select(`*, variants (*)`);

      if (activeCategory !== "All") {
        query = query.eq("category", activeCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
      } else if (data) {
        // Sort: In-stock first, then by image presence
        const sorted = data.sort((a, b) => {
          if (a.in_stock === b.in_stock) {
            return (b.image_url ? 1 : 0) - (a.image_url ? 1 : 0);
          }
          return b.in_stock - a.in_stock;
        });
        setProducts(sorted);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="shop-page bg-[#f4f4f5] min-h-screen pb-20">
      <SEO title="Shop Inventory" />

      {/* --- HEADER REMOVED --- */}

      <div className="container mx-auto px-4 mt-8 pt-24">
        {/* --- FILTERS --- */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar justify-center md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSearchParams({ category: cat.name })}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-md font-[Oswald] uppercase text-sm tracking-wide transition-all whitespace-nowrap border-2
                ${
                  activeCategory === cat.name
                    ? "bg-[var(--brick-red)] border-[var(--brick-red)] text-white shadow-[4px_4px_0px_0px_#000]"
                    : "bg-white border-[var(--baltic-sea)] text-[var(--baltic-sea)] hover:bg-gray-50"
                }
              `}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* --- GRID (2 Columns on Mobile) --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-gray-200 rounded-md animate-pulse border-2 border-gray-300"
                />
              ))
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {!loading && products.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-md">
            <p className="font-[Oswald] text-2xl text-gray-400 uppercase">
              No Items Found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- UPDATED PRODUCT CARD (BOXIER) ---
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const price = product.variants?.[0]?.price || 0;
  const isOutOfStock = !product.in_stock;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-md border-2 border-[var(--baltic-sea)] overflow-hidden flex flex-col h-full hover:shadow-[6px_6px_0px_0px_var(--baltic-sea)] transition-all duration-200 relative">
      {/* Stock Badge - Boxier (rounded-sm) */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`
          font-bold text-[10px] uppercase px-2 py-1 rounded-sm border border-black shadow-sm
          ${isOutOfStock ? "bg-red-100 text-red-600" : "bg-green-100 text-green-800"}
        `}
        >
          {isOutOfStock ? "Sold Out" : "In Stock"}
        </span>
      </div>

      {/* Image Area - FULL BLEED (No Padding) */}
      <div className="aspect-[4/5] bg-gray-100 border-b-2 border-[var(--baltic-sea)] relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="font-[Oswald] text-gray-400 text-3xl -rotate-12 opacity-50">
              NO IMG
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-sm">
            {product.category}
          </span>
        </div>

        <h3 className="font-[Oswald] text-lg uppercase leading-tight font-bold text-[var(--baltic-sea)] mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Short Name / REF code */}
        {product.short_name && (
          <p className="font-mono text-[10px] text-gray-400 mb-2">
            REF: {product.short_name}
          </p>
        )}

        {/* Price & Action Row - ALIGNED */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t-2 border-dashed border-gray-200">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-bold">
              Price
            </span>
            <span className="font-[Oswald] text-xl font-bold text-[var(--brick-red)]">
              ${price}
            </span>
          </div>

          {/* Button - Boxier (rounded-sm) and White Text */}
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`
              h-10 w-10 md:w-auto md:px-5 rounded-sm flex items-center justify-center gap-2 transition-all border-2 border-[var(--baltic-sea)]
              ${
                isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
                  : added
                    ? "bg-green-600 text-white border-green-700"
                    : "bg-[var(--baltic-sea)] text-white hover:bg-[var(--brick-red)] hover:border-[var(--brick-red)]"
              }
            `}
          >
            {isOutOfStock ? (
              <span className="text-xs font-bold">X</span>
            ) : added ? (
              <Check size={18} />
            ) : (
              <ShoppingCart size={18} className="text-white" />
            )}

            {!isOutOfStock && !added && (
              <span className="hidden md:inline font-[Oswald] uppercase text-sm font-bold tracking-wide text-white">
                Add
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
