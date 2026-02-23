import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../lib/CartContext";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product, loading }) {
  const { addToCart } = useCart();

  // Sort variants by price low-to-high
  const sortedVariants =
    product?.variants?.sort((a, b) => a.price - b.price) || [];
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (sortedVariants.length > 0) {
      setSelectedVariant(sortedVariants[0]);
    }
  }, [product]);

  // SKELETON LOADING STATE
  if (loading || !product) {
    return (
      <div className="border border-gray-200 rounded animate-pulse bg-white flex flex-col h-full">
        <div className="h-48 bg-gray-100 rounded-t w-full"></div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="mt-auto h-12 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  // --- STOCK LOGIC ---
  const isProductActive = product.in_stock !== false; // Reads from your Admin Panel toggle
  const canBuy = isProductActive;

  const displayImage =
    selectedVariant?.image_url ||
    product.image_url ||
    "https://via.placeholder.com/400";
  const isAccessory = product.category === "Accessories";

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (canBuy && selectedVariant) {
      addToCart(
        {
          ...product,
          id: product.id,
          price: selectedVariant.price,
          image: displayImage,
          variantId: selectedVariant.id,
        },
        1,
        selectedVariant.size_label,
      );
    }
  };

  return (
    <div
      className={`bg-white rounded border flex flex-col h-full transition-all duration-300 ${canBuy ? "border-gray-200 hover:shadow-lg hover:-translate-y-1" : "border-gray-100 opacity-75"}`}
    >
      {/* IMAGE CONTAINER */}
      <Link
        to={`/product/${product.id}`}
        className="relative block h-56 bg-gray-50 rounded-t overflow-hidden group"
      >
        {/* STOCK BADGE */}
        {!canBuy && (
          <div className="absolute top-3 right-3 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded z-10 border border-red-200">
            Out of Stock
          </div>
        )}
        {canBuy && (
          <div className="absolute top-3 right-3 bg-[#1b1b1b] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded z-10 shadow-sm">
            In Stock
          </div>
        )}

        <img
          src={displayImage}
          alt={`${product.name}`}
          loading="lazy"
          className={`w-full h-full object-contain p-4 transition-transform duration-500 ${canBuy ? "group-hover:scale-110" : "grayscale"}`}
        />
      </Link>

      {/* CARD DETAILS */}
      <div className="p-5 flex-1 flex flex-col">
        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="font-oswald text-xl uppercase tracking-wide text-[#1b1b1b] hover:text-[#ce2a34] transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Purity Tags */}
        {!isAccessory && (
          <div className="flex gap-2 mb-4">
            <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">
              Batch Verified
            </span>
            <span className="text-[10px] font-mono font-bold text-[#ce2a34] bg-red-50 px-2 py-0.5 rounded uppercase">
              &gt;99% Purity
            </span>
          </div>
        )}

        {/* Variant/Size & Price */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1">
              {selectedVariant ? selectedVariant.size_label : "Option"}
            </span>
            <span className="font-oswald text-2xl text-[#1b1b1b]">
              ${selectedVariant ? selectedVariant.price.toFixed(2) : "0.00"}
            </span>
          </div>
        </div>

        {/* ADD TO CART BUTTON */}
        <button
          disabled={!canBuy}
          onClick={handleAddToCart}
          className={`w-full py-3 rounded font-oswald uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
            canBuy
              ? "bg-[#1b1b1b] text-white hover:bg-[#ce2a34] shadow-md active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {canBuy ? (
            <>
              <ShoppingCart size={16} /> Add To Cart
            </>
          ) : (
            "Currently Unavailable"
          )}
        </button>
      </div>
    </div>
  );
}
