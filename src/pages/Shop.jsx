import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import SEO from "../components/SEO";
import {
  LayoutGrid,
  FlaskConical,
  Layers,
  Syringe,
  ShoppingCart,
} from "lucide-react";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const activeCategory = searchParams.get("category") || "All";

  const categories = [
    { name: "All", icon: <LayoutGrid size={16} /> },
    { name: "Peptides", icon: <FlaskConical size={16} /> },
    { name: "Peptide Blends", icon: <Layers size={16} /> },
    { name: "Accessories", icon: <Syringe size={16} /> },
  ];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase.from("products").select(`*, variants (*)`);
      if (activeCategory !== "All")
        query = query.eq("category", activeCategory);

      const { data } = await query;
      if (data) {
        // Sort: Images first
        const sorted = data.sort(
          (a, b) => (b.image_url ? 1 : 0) - (a.image_url ? 1 : 0),
        );
        setProducts(sorted);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="bg-[#f0f4f8] min-h-screen pb-20">
      <SEO title="Shop" />

      {/* HEADER */}
      <div className="bg-[var(--baltic-sea)] text-white py-12 md:py-20 px-4 border-b-4 border-[var(--brick-red)]">
        <div className="container-custom">
          <h1 className="font-[Oswald] text-5xl md:text-8xl uppercase font-bold tracking-tight leading-none">
            Catalog
          </h1>
          <p className="text-gray-400 font-mono mt-2 md:mt-4 uppercase tracking-widest text-xs md:text-sm">
            // STATUS: ACTIVE_INVENTORY // REGION: AU
          </p>
        </div>
      </div>

      <div className="container-custom mt-8 md:mt-12">
        {/* FILTERS (Scrollable on mobile) */}
        <div className="flex overflow-x-auto pb-4 md:pb-0 gap-3 md:gap-4 mb-8 md:mb-12 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSearchParams({ category: cat.name })}
              className={`
                whitespace-nowrap px-4 py-2 md:px-6 md:py-3 font-[Oswald] uppercase tracking-widest text-xs md:text-sm border-2 transition-all flex-shrink-0
                ${
                  activeCategory === cat.name
                    ? "bg-[var(--brick-red)] border-[var(--brick-red)] text-white shadow-[4px_4px_0px_0px_#000]"
                    : "bg-white border-gray-300 text-[var(--baltic-sea)] hover:border-[var(--brick-red)] hover:text-[var(--brick-red)]"
                }
              `}
            >
              <span className="flex items-center gap-2">
                {cat.icon} {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* BRUTALIST PRODUCT GRID - 2 COLUMNS ON MOBILE */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {loading ? (
            <p className="font-mono text-gray-500 animate-pulse col-span-full text-center">
              LOADING_DATABASE...
            </p>
          ) : (
            products.map((p) => <BrutalistCard key={p.id} product={p} />)
          )}
        </div>
      </div>
    </div>
  );
}

// Brutalist Product Card
function BrutalistCard({ product }) {
  const price = product.variants?.[0]?.price || 0;

  return (
    <div className="group bg-white border border-gray-300 md:border-2 md:border-[var(--baltic-sea)] hover:border-[var(--brick-red)] transition-colors flex flex-col h-full shadow-sm hover:shadow-[4px_4px_0px_0px_#ce2a34]">
      {/* Image Block */}
      <div className="relative aspect-square bg-gray-100 border-b border-gray-200 md:border-b-2 md:border-[var(--baltic-sea)] overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--baltic-sea)]">
            <span className="font-[Oswald] text-white/20 text-xl md:text-4xl font-bold uppercase rotate-[-15deg]">
              No Image
            </span>
          </div>
        )}

        {/* Status Tag */}
        <div className="absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 md:px-2 md:py-1 backdrop-blur-sm">
          <span
            className={`font-mono text-[10px] md:text-xs font-bold uppercase ${product.in_stock ? "text-green-700" : "text-red-600"}`}
          >
            {product.in_stock ? "IN STOCK" : "SOLD OUT"}
          </span>
        </div>
      </div>

      {/* Text Block */}
      <div className="p-3 md:p-5 flex flex-col flex-grow">
        <h3 className="font-[Oswald] font-bold text-sm md:text-xl uppercase leading-tight mb-1 text-[var(--baltic-sea)] line-clamp-2">
          {product.name}
        </h3>
        <span className="font-mono text-[10px] md:text-xs text-gray-500 mb-3 md:mb-6 block border-b border-gray-100 pb-2 md:pb-4">
          {product.category}
        </span>

        <div className="mt-auto">
          <div className="flex justify-between items-end mb-3 md:mb-4">
            <div>
              <span className="block text-[10px] font-bold uppercase text-[var(--brick-red)]">
                Unit Price
              </span>
              <span className="font-[Oswald] text-lg md:text-2xl font-bold text-[var(--baltic-sea)]">
                ${price}
              </span>
            </div>
          </div>

          <button className="w-full bg-[var(--baltic-sea)] text-white py-2 md:py-2.5 font-[Oswald] uppercase tracking-wider text-xs md:text-sm hover:bg-[var(--brick-red)] transition-colors flex items-center justify-center gap-2">
            <ShoppingCart size={14} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
