import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
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
  Search,
  X,
} from "lucide-react";
import "./Shop.css";
import "../components/ProductCard.css";

const PRODUCT_ORDER = [
  "HGH Kit (Blue Tops)",
  "Retatrutide",
  "Tirzepatide",
  "Cagrilintide",
  "GHK-Cu",
  "BPC-157",
  "BPC-157 & TB500 Blend", // Matches "BPC157 10mg + TB500 10mg"
  "KPV",
  "SS-31",
  "MOTS-C", // Capitalized C to match DB often
  "NAD+",
  "Thymosin Alpha-1",
  "Selank",
  "Semax",
  "CJC-1295 No DAC + Ipamorelin",
  "Tesamorelin",
  "Ipamorelin",
  "IGF-1 LR3",
  "PT-141",
  "AOD-9604",
  "Melanotan 1",
  "Melanotan 2",
  "DSIP",
  "Pinealon",
  "Epitalon",
  "Glutathione",
  "5-Amino-1MQ",
  "Oxytocin Acetate",
  "SLU-PP-322",
  "HCG", // Matches "HCG 10,000iu"
  "BAC Water",
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
        // Improved Sorting Logic
        const sorted = data.sort((a, b) => {
          // Normalize names: trim spaces and check against the list
          const nameA = a.name.trim();
          const nameB = b.name.trim();

          // Try to find exact match first, then partial match if needed
          let indexA = PRODUCT_ORDER.findIndex(
            (orderName) => nameA === orderName || nameA.includes(orderName),
          );
          let indexB = PRODUCT_ORDER.findIndex(
            (orderName) => nameB === orderName || nameB.includes(orderName),
          );

          // If not found in list, push to the bottom
          if (indexA === -1) indexA = 999;
          if (indexB === -1) indexB = 999;

          return indexA - indexB;
        });
        setProducts(sorted);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [activeCategory]);

  // Real-time filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.short_name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  return (
    <div className="shop-page bg-[#f4f4f5] min-h-screen pb-20">
      <SEO title="Shop Inventory" />

      <div className="container mx-auto px-4 mt-8 pt-24">
        {/* --- SEARCH BAR SECTION --- */}
        <div className="max-w-2xl mx-auto md:mx-0 mb-6">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search compounds (e.g. BPC-157)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shop-search-input font-oswald"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="clear-search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* --- CATEGORY FILTERS --- */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar justify-center md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setSearchParams({ category: cat.name });
                setSearchQuery(""); // Clear search when switching categories
              }}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-md font-[Oswald] uppercase text-sm tracking-wide transition-all whitespace-nowrap border-2
                ${
                  activeCategory === cat.name
                    ? "bg-[#ce2a34] border-[#ce2a34] text-white shadow-[4px_4px_0px_0px_#000]"
                    : "bg-white border-[#1b1b1b] text-[#1b1b1b] hover:bg-gray-50"
                }
              `}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* --- PRODUCTS GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-200 rounded-md animate-pulse border-2 border-gray-300"
              />
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="col-span-full text-center py-20 border-2 border-dashed border-gray-300 rounded-md">
              <p className="font-[Oswald] text-2xl text-gray-400 uppercase">
                No Results Found for "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ProductCard Component
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const sortedVariants =
    product?.variants?.sort(
      (a, b) => parseFloat(a.price) - parseFloat(b.price),
    ) || [];

  useEffect(() => {
    if (sortedVariants.length > 0) {
      setSelectedVariant(sortedVariants[0]);
    }
  }, [product]);

  const isOutOfStock = !product.in_stock;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || !selectedVariant) return;

    const itemToAdd = {
      ...product,
      variantId: selectedVariant.id,
      price: parseFloat(selectedVariant.price),
      sizeLabel: selectedVariant.size_label,
    };

    addToCart(itemToAdd);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card group">
      <Link
        to={`/product/${product.id}`}
        className="flex flex-col h-full text-inherit no-underline"
      >
        <div className="card-image-wrapper">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="product-img"
            />
          ) : (
            <div className="no-img-placeholder">
              <FlaskConical size={48} strokeWidth={1} />
              <span className="font-oswald">LABS</span>
            </div>
          )}

          {isOutOfStock && (
            <div className="sold-out-overlay">
              <span className="sold-out-tag">SOLD OUT</span>
            </div>
          )}
        </div>

        <div className="card-info">
          <div className="card-header">
            <span className="category-tag">{product.category}</span>
            {product.short_name && (
              <span className="ref-code">REF: {product.short_name}</span>
            )}
          </div>

          <h3 className="product-name font-oswald">{product.name}</h3>

          {sortedVariants.length > 0 && (
            <div className="selector-row">
              <div className="variant-pills no-scrollbar">
                {sortedVariants.map((v) => (
                  <button
                    key={v.id}
                    className={`variant-pill ${selectedVariant?.id === v.id ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariant(v);
                    }}
                  >
                    {v.size_label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="action-row">
            <div className="price-box">
              <span className="price-label">PRICE</span>
              <span className="price-value font-oswald">
                ${selectedVariant ? selectedVariant.price : "0"}
              </span>
            </div>

            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`add-to-cart-btn ${added ? "success" : ""} ${isOutOfStock ? "disabled" : ""}`}
            >
              {added ? <Check size={18} /> : <ShoppingCart size={18} />}
              <span className="btn-text font-oswald">
                {added ? "ADDED" : isOutOfStock ? "X" : "ADD"}
              </span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
