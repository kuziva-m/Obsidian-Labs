import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layers, Syringe, ShoppingCart, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useCart } from "../../lib/CartContext";
import "./Services.css";

export default function Services() {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPopular() {
      const { data, error } = await supabase
        .from("products")
        .select(`*, variants (*)`)
        .limit(3);

      if (!error && data) {
        setPopularProducts(data);
      }
      setLoading(false);
    }
    fetchPopular();
  }, []);

  return (
    <section id="inventory" className="section bg-[#f4f4f5]">
      <div className="container mx-auto px-4">
        {/* --- PART 1: POPULAR PEPTIDES --- */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8 justify-center">
            <div className="h-[2px] w-12 bg-[var(--brick-red)]"></div>
            <h2 className="font-[Oswald] text-3xl md:text-4xl uppercase text-[var(--baltic-sea)]">
              Shop Popular Peptides
            </h2>
            <div className="h-[2px] w-12 bg-[var(--brick-red)]"></div>
          </div>

          {/* UPDATED GRID: 2 cols on mobile, 3 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {loading
              ? [1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-80 bg-gray-200 animate-pulse rounded-md"
                  />
                ))
              : popularProducts.map((product, index) => (
                  <div
                    key={product.id}
                    // HIDE the 3rd item on mobile so we just have 2 side-by-side
                    className={index === 2 ? "hidden md:block" : "block"}
                  >
                    <ServiceProductCard product={product} />
                  </div>
                ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              to="/shop"
              className="px-8 py-3 bg-[var(--baltic-sea)] text-white font-[Oswald] uppercase tracking-widest hover:bg-[var(--brick-red)] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] rounded-md"
            >
              View Full Catalog
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- SUB-COMPONENT: CATEGORY CARD ---
function ServiceCard({ icon, title, text, link }) {
  return (
    <article className="bg-white p-6 md:p-8 border-2 border-gray-200 rounded-md hover:border-[var(--brick-red)] transition-all group hover:shadow-xl flex flex-col items-center text-center h-full">
      <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-full group-hover:bg-red-50 transition-colors">
        {icon}
      </div>
      <h3 className="font-[Oswald] text-lg md:text-xl uppercase mb-2 md:mb-3 text-[var(--baltic-sea)] leading-tight">
        {title}
      </h3>
      <p className="font-mono text-xs md:text-sm text-gray-500 mb-4 md:mb-6 leading-relaxed max-w-xs">
        {text}
      </p>
      <Link
        className="mt-auto font-[Oswald] text-xs md:text-sm uppercase font-bold text-[var(--brick-red)] flex items-center gap-1 hover:gap-2 transition-all"
        to={link}
      >
        View Catalog <span aria-hidden="true">›</span>
      </Link>
    </article>
  );
}

// --- SUB-COMPONENT: PRODUCT CARD ---
function ServiceProductCard({ product }) {
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
      {/* Stock Badge */}
      <div className="absolute top-2 right-2 z-10">
        <span
          className={`
          font-bold text-[8px] md:text-[10px] uppercase px-2 py-1 rounded-sm border border-black shadow-sm
          ${isOutOfStock ? "bg-red-100 text-red-600" : "bg-green-100 text-green-800"}
        `}
        >
          {isOutOfStock ? "Sold Out" : "In Stock"}
        </span>
      </div>

      {/* Image Area */}
      <div className="aspect-[4/5] bg-gray-100 border-b-2 border-[var(--baltic-sea)] relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="font-[Oswald] text-gray-400 text-2xl -rotate-12 opacity-50">
              NO IMG
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <h3 className="font-[Oswald] text-sm md:text-lg uppercase leading-tight font-bold text-[var(--baltic-sea)] mb-2 md:mb-4 line-clamp-2 min-h-[2rem] md:min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price & Action Row */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t-2 border-dashed border-gray-200">
          <div className="flex flex-col">
            <span className="text-[8px] md:text-[10px] text-gray-500 uppercase font-bold">
              Price
            </span>
            <span className="font-[Oswald] text-lg md:text-xl font-bold text-[var(--brick-red)]">
              ${price}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`
              h-8 md:h-10 px-3 md:px-4 rounded-sm flex items-center justify-center gap-2 transition-all border-2 border-[var(--baltic-sea)]
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
              <Check size={16} />
            ) : (
              <ShoppingCart size={16} className="text-white" />
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
