import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Loader2, ShoppingCart, Check } from "lucide-react";

export default function ProductPage() {
  const { slug } = useParams(); // Get the product ID or Slug from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);

      // 1. Try to fetch by ID (if slug is UUID)
      let { data, error } = await supabase
        .from("products")
        .select(`*, variants(*)`)
        .eq("id", slug) // Assuming the URL uses ID for now
        .single();

      // 2. If valid UUID failed or slug isn't UUID, you might search by name/slug column if you have one
      // For now, we assume the link passed the ID.

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]); // Select first variant by default
        }
      }
      setLoading(false);
    }

    fetchProduct();
  }, [slug]);

  const addToCart = () => {
    if (!product || !selectedVariant) return;

    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if item exists
    const existingItemIndex = existingCart.findIndex(
      (item) => item.variantId === selectedVariant.id,
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        variantId: selectedVariant.id,
        price: selectedVariant.price,
        image: product.image_url,
        quantity: 1,
        variants: [selectedVariant], // Store variant info for checkout
      });
    }

    // Save back
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Dispatch event so Navbar updates count
    window.dispatchEvent(new Event("storage"));
    alert("Added to cart!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f5]">
        <Loader2 className="animate-spin text-[#ce2a34]" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-400">Product Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* LEFT: IMAGE */}
          <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-400 font-bold text-xl">NO IMAGE</div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div className="flex flex-col justify-center">
            <h1 className="font-[Oswald] text-4xl uppercase text-[#1b1b1b] mb-2">
              {product.name}
            </h1>
            <div className="h-1 w-20 bg-[#ce2a34] mb-6"></div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description || "No description available."}
            </p>

            {/* Price */}
            <div className="text-3xl font-bold text-[#ce2a34] mb-8 font-mono">
              ${selectedVariant ? selectedVariant.price.toFixed(2) : "0.00"}
            </div>

            {/* Variant Selector (if multiple) */}
            {product.variants && product.variants.length > 1 && (
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                  Select Option
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 border rounded text-sm font-bold uppercase transition-all ${
                        selectedVariant?.id === v.id
                          ? "bg-[#1b1b1b] text-white border-[#1b1b1b]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {v.size_label || "Standard"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={addToCart}
              className="w-full md:w-auto bg-[#ce2a34] text-white py-4 px-8 rounded font-[Oswald] uppercase tracking-widest hover:bg-[#1b1b1b] transition-colors flex items-center justify-center gap-3"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
