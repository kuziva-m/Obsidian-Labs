import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useCart } from "../lib/CartContext";
import {
  ArrowLeft,
  Check,
  ShoppingCart,
  ShieldCheck,
  Truck,
  AlertTriangle,
} from "lucide-react";
import "./ProductPage.css"; // Ensure you create this CSS file below
import SEO from "../components/SEO";

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      // 1. Fetch Product by Slug (or ID if you use IDs in URL)
      // Assuming 'slug' matches 'id' or you have a slug column.
      // The '*' in select will automatically include your new 'product_page_title' column.
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          variants (*)
        `,
        )
        .eq("id", slug) // OR .eq("slug", slug) if you have one
        .single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
        // Default to first variant
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    // Create a "Cart Item" object
    const cartItem = {
      ...product,
      variants: [selectedVariant], // Pass only the selected variant
      quantity: quantity,
    };

    addToCart(cartItem);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product Not Found
      </div>
    );

  const isOutOfStock = !product.in_stock;

  // Determine the display title: Use the new column if available, fallback to standard name
  const pageTitle = product.product_page_title || product.name;

  return (
    <div className="bg-white min-h-screen pb-20">
      <SEO title={`${pageTitle} - Obsidian Labs`} />

      {/* HEADER / BREADCRUMB */}
      <div className="bg-[#1b1b1b] text-white py-6">
        <div className="container mx-auto px-4">
          <Link
            to="/shop"
            className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-mono uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Catalog
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* --- LEFT: IMAGES --- */}
          <div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative aspect-square">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={pageTitle}
                  className="w-full h-full object-contain mix-blend-multiply p-10"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 font-oswald text-3xl">
                  NO IMAGE
                </div>
              )}
              {isOutOfStock && (
                <div className="absolute top-4 left-4 bg-red-100 text-red-600 px-3 py-1 font-bold text-xs uppercase tracking-widest border border-red-200">
                  Sold Out
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded">
                <ShieldCheck className="text-[#ce2a34]" size={24} />
                <div>
                  <div className="font-oswald uppercase text-sm text-[#1b1b1b]">
                    Purity Tested
                  </div>
                  <div className="text-xs text-gray-500">
                    HPLC Verified &ge;99%
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded">
                <Truck className="text-[#ce2a34]" size={24} />
                <div>
                  <div className="font-oswald uppercase text-sm text-[#1b1b1b]">
                    Express Ship
                  </div>
                  <div className="text-xs text-gray-500">
                    Dispatched from VIC
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT: DETAILS --- */}
          <div>
            <div className="mb-2">
              <span className="text-[#ce2a34] font-bold text-xs uppercase tracking-[0.2em]">
                Research Compound
              </span>
            </div>
            <h1 className="font-oswald text-5xl text-[#1b1b1b] uppercase mb-6 leading-tight">
              {pageTitle}
            </h1>

            {/* Price Display */}
            <div className="flex items-baseline gap-4 mb-8 border-b border-gray-100 pb-8">
              <span className="text-4xl font-bold text-[#ce2a34] font-oswald">
                ${selectedVariant ? selectedVariant.price.toFixed(2) : "0.00"}
              </span>
              <span className="text-gray-400 font-mono text-sm uppercase">
                AUD / Excl. GST
              </span>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-3 tracking-wider">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`
                        px-6 py-3 border-2 font-oswald uppercase text-sm tracking-wide transition-all
                        ${
                          selectedVariant?.id === variant.id
                            ? "border-[#1b1b1b] bg-[#1b1b1b] text-white"
                            : "border-gray-200 text-gray-600 hover:border-gray-400"
                        }
                      `}
                    >
                      {variant.size_label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center border-2 border-gray-200 w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-12 flex items-center justify-center hover:bg-gray-100 text-lg font-bold"
                >
                  -
                </button>
                <div className="flex-grow text-center font-oswald text-lg">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-12 flex items-center justify-center hover:bg-gray-100 text-lg font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`
                  flex-grow h-12 flex items-center justify-center gap-3 uppercase font-oswald tracking-widest font-bold transition-all
                  ${
                    isOutOfStock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : added
                        ? "bg-green-600 text-white"
                        : "bg-[#ce2a34] text-white hover:bg-[#a31a22] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-none"
                  }
                `}
              >
                {isOutOfStock ? (
                  "Out of Stock"
                ) : added ? (
                  <>
                    Added <Check size={20} />
                  </>
                ) : (
                  <>
                    Add to Cart <ShoppingCart size={20} />
                  </>
                )}
              </button>
            </div>

            {/* --- RICH DESCRIPTION SECTION --- */}
            {product.description && (
              <div className="description-container">
                <h3 className="font-oswald text-xl uppercase border-b-2 border-[#ce2a34] inline-block mb-6 pb-1">
                  Product Description
                </h3>

                {/* SAFE HTML RENDERING */}
                <div
                  className="product-rich-text font-body text-gray-600 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {!product.description && (
              <div className="bg-gray-50 p-6 rounded border border-gray-200 text-center text-gray-500">
                Detailed research information is available upon request.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
