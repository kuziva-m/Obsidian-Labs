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
    // If there is only 1 size, select it automatically.
    // If there are MULTIPLE sizes, leave it null to FORCE the user to select one!
    if (sortedVariants.length === 1) {
      setSelectedVariant(sortedVariants[0]);
    } else if (sortedVariants.length > 1) {
      setSelectedVariant(null);
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

  // --- STOCK & BUY LOGIC ---
  const isProductActive = product.in_stock !== false;
  const isVariantInStock = selectedVariant
    ? selectedVariant.in_stock !== false
    : true;
  const hasSelected = sortedVariants.length <= 1 || selectedVariant !== null;
  const canBuy = isProductActive && isVariantInStock && hasSelected;

  const displayImage =
    selectedVariant?.image_url ||
    product.image_url ||
    "https://via.placeholder.com/400";
  const isAccessory = product.category === "Accessories";

  // Dynamic Price Display (Shows range if not selected yet)
  const getPriceDisplay = () => {
    if (selectedVariant) return `$${selectedVariant.price.toFixed(2)}`;
    if (sortedVariants.length > 1) {
      const min = sortedVariants[0].price;
      const max = sortedVariants[sortedVariants.length - 1].price;
      return min === max
        ? `$${min.toFixed(2)}`
        : `$${min.toFixed(2)} - $${max.toFixed(2)}`;
    }
    return "Unavailable";
  };

  // Dynamic Button Text
  let buttonText = "Add To Cart";
  if (!isProductActive) buttonText = "Currently Unavailable";
  else if (sortedVariants.length > 1 && !selectedVariant)
    buttonText = "Select Size Required";
  else if (selectedVariant && selectedVariant.in_stock === false)
    buttonText = "Out of Stock";

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
      className={`bg-white rounded border flex flex-col h-full transition-all duration-300 ${isProductActive ? "border-gray-200 hover:shadow-lg hover:-translate-y-1" : "border-gray-100 opacity-80"}`}
    >
      {/* IMAGE CONTAINER */}
      <Link
        to={`/product/${product.id}`}
        className="relative block h-56 bg-gray-50 rounded-t overflow-hidden group"
      >
        {/* STOCK BADGE */}
        {!isProductActive && (
          <div className="absolute top-3 right-3 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded z-10 border border-red-200">
            Out of Stock
          </div>
        )}
        {isProductActive && (
          <div className="absolute top-3 right-3 bg-[#1b1b1b] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded z-10 shadow-sm">
            In Stock
          </div>
        )}

        <img
          src={displayImage}
          alt={`${product.name}`}
          loading="lazy"
          className={`w-full h-full object-contain p-4 transition-transform duration-500 ${isProductActive ? "group-hover:scale-110" : "grayscale opacity-60"}`}
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

        <div className="mt-auto pt-4 border-t border-gray-100">
          {/* Price Display */}
          <div className="mb-3">
            <span className="font-oswald text-2xl text-[#1b1b1b]">
              {getPriceDisplay()}
            </span>
          </div>

          {/* VARIANT BUTTONS (PILLS) */}
          {sortedVariants.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {sortedVariants.map((v) => {
                const isVStock = v.in_stock !== false;
                return (
                  <button
                    type="button"
                    key={v.id}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedVariant(v);
                    }}
                    disabled={!isVStock}
                    className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest rounded border transition-all ${
                      selectedVariant?.id === v.id
                        ? "bg-[#1b1b1b] text-white border-[#1b1b1b]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#ce2a34] hover:text-[#ce2a34]"
                    } ${!isVStock ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                    title={!isVStock ? "Out of Stock" : ""}
                  >
                    {v.size_label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Single Custom Variant Label (if only 1 exists and it's not named 'Standard') */}
          {sortedVariants.length === 1 &&
            sortedVariants[0].size_label !== "Standard" && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-mono font-bold uppercase tracking-widest rounded border border-gray-200">
                  {sortedVariants[0].size_label}
                </span>
              </div>
            )}

          {/* ADD TO CART BUTTON */}
          <button
            disabled={!canBuy}
            onClick={handleAddToCart}
            className={`w-full py-3 rounded font-oswald uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
              canBuy
                ? "bg-[#1b1b1b] text-white hover:bg-[#ce2a34] shadow-md active:scale-95"
                : "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
            }`}
          >
            {canBuy ? <ShoppingCart size={16} /> : null}
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
