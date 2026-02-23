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
} from "lucide-react";

export default function Shop({ searchQuery }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize category from URL or default to "All"
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
        .select(`*, variants (*)`)
        .order("name");

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
    if (searchQuery && searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
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

    // 4. Sort Categories
    const sortOrder = ["Peptides", "Peptide Blends", "Accessories"];
    const sortedGrouped = Object.entries(grouped).sort(([catA], [catB]) => {
      const indexA = sortOrder.indexOf(catA);
      const indexB = sortOrder.indexOf(catB);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return catA.localeCompare(catB);
    });

    return sortedGrouped;
  }, [products, searchQuery, activeCategory]);

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
          <p className="font-body text-gray-500 max-w-2xl mx-auto">
            High-purity synthetic compounds intended strictly for in-vitro
            cellular research and analytical use. Not for human consumption.
          </p>
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
        /* Hide scrollbar for category tabs on mobile while keeping functionality */
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
