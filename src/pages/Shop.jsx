import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";
import {
  LayoutGrid,
  FlaskConical,
  Layers,
  BriefcaseMedical,
  Search,
  X,
} from "lucide-react";

// --- CLIENT'S CUSTOM SORT ORDER ---
const PRODUCT_SORT_ORDER = [
  "hgh",
  "retatrutide",
  "tirzepatide",
  "mounjaro",
  "cagrilintide",
  "ghk",
  "bpc",
  "kpv",
  "ss-31",
  "mots",
  "nad",
  "thymosin",
  "selank",
  "semax",
  "cjc",
  "tesamorelin",
  "ipamorelin",
  "igf",
  "pt-141",
  "aod",
  "melanotan 1",
  "melanotan 2",
  "dsip",
  "pinealon",
  "epitalon",
  "glutathione",
  "5-amino",
  "oxytocin",
  "slu",
  "hcg",
  "bac water",
];

const getSortIndex = (productName) => {
  const lowerName = productName.toLowerCase();
  const index = PRODUCT_SORT_ORDER.findIndex((keyword) =>
    lowerName.includes(keyword),
  );
  return index === -1 ? 999 : index;
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "All",
  );

  const categories = [
    { name: "All", icon: <LayoutGrid size={18} /> },
    { name: "Peptides", icon: <FlaskConical size={18} /> },
    { name: "Peptide Blends", icon: <Layers size={18} /> },
    { name: "Accessories", icon: <BriefcaseMedical size={18} /> },
  ];

  useEffect(() => {
    const catFromUrl = searchParams.get("category");
    if (catFromUrl) setActiveCategory(catFromUrl);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`*, variants (*)`);

      if (error) throw error;
      if (data) setProducts(data);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredGroupedProducts = useMemo(() => {
    let result = products;

    // 1. Filter by Search
    if (searchTerm && searchTerm.trim() !== "") {
      const lowerQuery = searchTerm.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(lowerQuery),
      );
    }

    // 2. Filter by Category Tab
    if (activeCategory !== "All") {
      result = result.filter((product) => product.category === activeCategory);
    }

    // 3. Group Items by Category
    const grouped = result.reduce((acc, product) => {
      const cat = product.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    }, {});

    // 4. Sort Categories & Products
    const sortOrder = ["Peptides", "Peptide Blends", "Accessories"];

    const sortedGrouped = Object.entries(grouped)
      .sort(([catA], [catB]) => {
        const indexA = sortOrder.indexOf(catA);
        const indexB = sortOrder.indexOf(catB);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return catA.localeCompare(catB);
      })
      .map(([category, items]) => {
        items.sort((a, b) => {
          const indexA = getSortIndex(a.name);
          const indexB = getSortIndex(b.name);

          if (indexA !== indexB) {
            return indexA - indexB;
          }
          return a.name.localeCompare(b.name);
        });

        return [category, items];
      });

    return sortedGrouped;
  }, [products, searchTerm, activeCategory]);

  return (
    <div className="bg-[#f4f4f5] min-h-screen py-12">
      <SEO
        title="Shop High-Purity Peptides | Obsidian Labs"
        description="Browse our range of batch-verified research peptides, blends, and mixing solutions. Fast dispatch Australia-wide from Melbourne."
      />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="font-oswald text-4xl md:text-5xl uppercase text-[#1b1b1b] mb-4 tracking-wide">
            Laboratory <span className="text-[#ce2a34]">Inventory</span>
          </h1>
          <p className="font-body text-gray-500 max-w-2xl mx-auto mb-10">
            High-purity synthetic compounds intended strictly for in-vitro
            cellular research and analytical use. Not for human consumption.
          </p>

          {/* --- BRANDED SEARCH BAR --- */}
          <div className="relative w-full max-w-2xl mx-auto group z-10 mb-10">
            {/* Decorative Top Accent Line */}
            <div className="absolute -top-[2px] left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#ce2a34] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 z-20"></div>

            <div className="relative flex items-center w-full bg-white border-2 border-gray-200 focus-within:border-[#1b1b1b] focus-within:shadow-[6px_6px_0px_0px_#ce2a34] focus-within:-translate-y-[2px] transition-all duration-300 rounded-sm overflow-hidden">
              <div className="pl-5 pr-2 text-gray-400 group-focus-within:text-[#ce2a34] transition-colors">
                <Search size={20} strokeWidth={2.5} />
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH COMPOUNDS, PEPTIDES, OR BLENDS..."
                className="w-full py-4 pl-2 pr-12 font-oswald tracking-wide text-sm md:text-base text-[#1b1b1b] bg-transparent outline-none placeholder:text-gray-400 placeholder:font-oswald uppercase"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 p-1.5 text-gray-400 hover:text-white hover:bg-[#ce2a34] rounded-sm transition-all bg-white shadow-sm border border-gray-100"
                  aria-label="Clear search"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              )}
            </div>
          </div>
          {/* --------------------------- */}
        </div>

        {/* CATEGORY TABS */}
        <div className="flex justify-center mb-12 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-2 bg-white p-1.5 rounded border border-gray-200 shadow-sm inline-flex">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded font-oswald uppercase tracking-widest text-sm transition-all whitespace-nowrap ${
                  activeCategory === cat.name
                    ? "bg-[#1b1b1b] text-white shadow"
                    : "text-gray-500 hover:text-[#ce2a34] hover:bg-gray-50"
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* GRID RESULTS */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <ProductCard key={n} loading={true} />
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {filteredGroupedProducts.length === 0 && (
              <div className="text-center py-20 bg-white border border-gray-200 rounded">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-oswald text-2xl uppercase text-gray-400">
                  No Compounds Found
                </h3>
                <p className="text-gray-500 font-mono mt-2">
                  Try adjusting your search criteria.
                </p>
              </div>
            )}

            {filteredGroupedProducts.map(([category, items]) => (
              <section key={category}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-oswald text-2xl md:text-3xl uppercase text-[#1b1b1b] m-0">
                    {category}
                  </h2>
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      loading={false}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
