import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function ProductCard({ product }) {
  // If product is missing or loading, show a skeleton loader
  if (!product) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse h-[300px]">
        <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
        <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
        <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
      </div>
    );
  }

  // Get price from the first variant, or default to 0
  const mainPrice =
    product.variants && product.variants.length > 0
      ? product.variants[0].price
      : 0;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Image Area */}
      <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-gray-300 text-4xl font-bold opacity-20">
            LABS
          </div>
        )}

        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs font-semibold text-[var(--brick-red)] mb-1 uppercase tracking-wider">
          {product.category}
        </div>
        <h3 className="font-bold text-lg text-[var(--baltic-sea)] mb-2 leading-tight">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">
              Starting at
            </span>
            <span className="text-lg font-bold text-[var(--baltic-sea)]">
              ${mainPrice}
            </span>
          </div>

          <button className="bg-[var(--baltic-sea)] text-white p-2.5 rounded-lg hover:bg-[var(--brick-red)] transition-colors group-hover:translate-x-1 duration-300">
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
