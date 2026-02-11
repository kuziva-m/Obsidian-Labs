import { useEffect, useState } from "react";
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
} from "lucide-react";
import "./Shop.css";
import "../components/ProductCard.css";

// 1. Define the exact order based on your note list
const PRODUCT_ORDER = [
  "HGH Kit (Blue Tops)",
  "Retatrutide",
  "Tirzepatide (Mounjaro)",
  "Cagrilintide",
  "GHK-Cu",
  "BPC-157",
  "BPC-157 + TB-500 Blend",
  "KPV",
  "SS-31",
  "MOTS-c",
  "NAD+",
  "Thymosin Alpha-1",
  "Selank",
  "Semax",
  "CJC-1295 (No DAC) + Ipamorelin",
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
  "5-amino-1mq",
  "Oxytocin Acetate",
  "SLU-PP-322",
  "HCG",
  "BAC Water",
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // 2. Apply the custom sort logic
        const sorted = data.sort((a, b) => {
          const indexA = PRODUCT_ORDER.indexOf(a.name);
          const indexB = PRODUCT_ORDER.indexOf(b.name);

          // If a name isn't in our list, put it at the end
          const finalA = indexA === -1 ? 999 : indexA;
          const finalB = indexB === -1 ? 999 : indexB;

          return finalA - finalB;
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

      <div className="container mx-auto px-4 mt-8 pt-24">
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
