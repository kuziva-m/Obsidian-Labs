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
  PlusCircle,
} from "lucide-react";
import { getRelatedProductSlugsForProduct } from "../lib/productRelationships";
import "./ProductPage.css";
import SEO from "../components/SEO";

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // --- RELATED PRODUCTS STATE ---
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [selectedRelatedVariants, setSelectedRelatedVariants] = useState({});

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          slug,
        );

      let query = supabase.from("products").select(`*, variants (*)`);

      if (isUUID) {
        query = query.eq("id", slug);
      } else {
        query = query.eq("slug", slug);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          // Sort variants by price to ensure consistency
          const sortedVariants = [...data.variants].sort(
            (a, b) => a.price - b.price,
          );
          setSelectedVariant(sortedVariants[0]);
        }
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  // --- FETCH RELATED PRODUCTS ---
  useEffect(() => {
    async function fetchRelatedProducts() {
      if (!product?.slug) {
        setRelatedProducts([]);
        return;
      }

      const relatedSlugs = getRelatedProductSlugsForProduct(product.slug);

      if (!relatedSlugs.length) {
        setRelatedProducts([]);
        return;
      }

      setLoadingRelated(true);

      const { data, error } = await supabase
        .from("products")
        .select("*, variants (*)")
        .in("slug", relatedSlugs);

      if (error || !data) {
        setRelatedProducts([]);
        setLoadingRelated(false);
        return;
      }

      const ordered = relatedSlugs
        .map((relatedSlug) => data.find((item) => item.slug === relatedSlug))
        .filter(Boolean)
        .map((item) => {
          // Filter hidden or out of stock variants for suggestions
          const purchasableVariants = (item.variants || [])
            .filter((v) => v.is_hidden !== true)
            .filter((v) => v.in_stock !== false)
            .sort((a, b) => (a.price || 0) - (b.price || 0));

          const defaultVariant = purchasableVariants[0] || null;

          return { ...item, purchasableVariants, defaultVariant };
        })
        .filter((item) => item.slug !== product.slug && item.defaultVariant);

      // Set default selected variants for dropdowns
      const nextSelectedVariants = {};
      ordered.forEach((p) => {
        nextSelectedVariants[p.id] = p.defaultVariant.id;
      });

      setRelatedProducts(ordered.slice(0, 4));
      setSelectedRelatedVariants(nextSelectedVariants);
      setLoadingRelated(false);
    }

    fetchRelatedProducts();
  }, [product]);

  // --- ADD MAIN PRODUCT ---
  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addToCart(
      {
        ...product,
        id: product.id,
        price: selectedVariant.price,
        image: selectedVariant.image_url || product.image_url,
        variantId: selectedVariant.id,
      },
      quantity,
      selectedVariant.size_label,
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // --- ADD RELATED PRODUCT ---
  const handleAddRelated = (relatedProduct) => {
    if (!relatedProduct?.purchasableVariants?.length) return;

    const selectedVariantId = selectedRelatedVariants[relatedProduct.id];
    const relatedVariant =
      relatedProduct.purchasableVariants.find(
        (v) => v.id === selectedVariantId,
      ) || relatedProduct.defaultVariant;

    if (!relatedVariant) return;

    addToCart(
      {
        ...relatedProduct,
        id: relatedProduct.id,
        price: relatedVariant.price,
        image: relatedVariant.image_url || relatedProduct.image_url,
        variantId: relatedVariant.id,
      },
      1,
      relatedVariant.size_label,
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-oswald text-2xl tracking-widest text-[#1b1b1b] uppercase">
        Accessing Database...
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-oswald text-2xl tracking-widest text-[#1b1b1b] uppercase gap-4">
        Compound Not Found
        <Link
          to="/products"
          className="text-sm bg-[#ce2a34] text-white px-6 py-3 hover:bg-[#1b1b1b] transition-colors"
        >
          Return to Inventory
        </Link>
      </div>
    );

  const isOutOfStock =
    !product.in_stock ||
    (selectedVariant && selectedVariant.in_stock === false);
  const pageTitle = product.product_page_title || product.name;

  return (
    <div className="bg-white min-h-screen pb-20">
      <SEO title={`${pageTitle} - Obsidian Labs`} />

      {/* HEADER / BREADCRUMB */}
      <div className="bg-[#1b1b1b] text-white py-6">
        <div className="container mx-auto px-4">
          <Link
            to="/products"
            className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-mono uppercase tracking-widest w-max"
          >
            <ArrowLeft size={14} /> Back to Catalog
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* --- LEFT: IMAGES --- */}
          <div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative aspect-square">
              {product.image_url ? (
                <img
                  src={selectedVariant?.image_url || product.image_url}
                  alt={pageTitle}
                  className="w-full h-full object-cover mix-blend-multiply"
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
              <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded shadow-sm">
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
              <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded shadow-sm">
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
                {product.category || "Research Compound"}
              </span>
            </div>
            <h1 className="font-oswald text-4xl md:text-5xl text-[#1b1b1b] uppercase mb-6 leading-tight">
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
                  {product.variants.map((variant) => {
                    const isVStock = variant.in_stock !== false;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={!isVStock}
                        className={`
                          px-6 py-3 border-2 font-oswald uppercase text-sm tracking-wide transition-all
                          ${
                            selectedVariant?.id === variant.id
                              ? "border-[#1b1b1b] bg-[#1b1b1b] text-white"
                              : "border-gray-200 text-gray-600 hover:border-gray-400"
                          }
                          ${!isVStock ? "opacity-40 cursor-not-allowed line-through hover:border-gray-200" : ""}
                        `}
                      >
                        {variant.size_label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to Cart Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border-2 border-gray-200 w-32 rounded-sm bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-12 flex items-center justify-center hover:bg-gray-50 text-lg font-bold text-[#1b1b1b]"
                >
                  -
                </button>
                <div className="flex-grow text-center font-oswald text-lg text-[#1b1b1b]">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-12 flex items-center justify-center hover:bg-gray-50 text-lg font-bold text-[#1b1b1b]"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`
                  flex-grow h-[52px] flex items-center justify-center gap-3 uppercase font-oswald tracking-widest font-bold transition-all rounded-sm
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

            {/* Warning Box */}
            {product.category !== "Accessories" && (
              <div className="mb-10 bg-[#fef2f2] border-l-4 border-[#ce2a34] p-4 text-sm text-[#7f1d1d] font-body flex gap-3 shadow-sm rounded-r-md">
                <AlertTriangle
                  className="shrink-0 mt-0.5 text-[#ce2a34]"
                  size={18}
                />
                <div>
                  <strong className="font-oswald uppercase tracking-widest block mb-1 text-[#ce2a34]">
                    Research Only
                  </strong>
                  This compound is strictly for laboratory research use. Not for
                  human consumption.
                </div>
              </div>
            )}

            {/* --- FREQUENTLY PAIRED WITH SECTION --- */}
            {relatedProducts.length > 0 && (
              <div className="mb-12">
                <h3 className="font-oswald text-xl uppercase text-[#1b1b1b] mb-4 tracking-wide flex items-center gap-2">
                  <span className="bg-[#ce2a34] w-1.5 h-5 inline-block"></span>
                  Frequently Paired With
                </h3>

                {loadingRelated ? (
                  <div className="animate-pulse text-gray-400 font-mono text-sm uppercase">
                    Analyzing Combinations...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedProducts.map((related) => {
                      const relatedVariantId =
                        selectedRelatedVariants[related.id];
                      const rVariant =
                        related.purchasableVariants.find(
                          (v) => v.id === relatedVariantId,
                        ) || related.defaultVariant;

                      return (
                        <div
                          key={related.id}
                          className="border border-gray-200 bg-white p-4 flex flex-col hover:shadow-md transition-shadow rounded-sm group"
                        >
                          <Link
                            to={`/product/${related.slug}`}
                            className="flex items-center gap-4 mb-3"
                          >
                            <div className="w-16 h-16 bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center p-1 rounded-sm overflow-hidden">
                              <img
                                src={rVariant?.image_url || related.image_url}
                                alt={related.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-oswald uppercase text-[#1b1b1b] text-sm leading-tight truncate group-hover:text-[#ce2a34] transition-colors">
                                {related.name}
                              </h4>
                              {related.purchasableVariants.length > 1 ? (
                                <select
                                  onClick={(e) => e.preventDefault()}
                                  className="w-full mt-2 bg-gray-50 border border-gray-200 font-mono text-[10px] p-1.5 text-[#1b1b1b] outline-none font-bold uppercase cursor-pointer"
                                  value={rVariant?.id || ""}
                                  onChange={(e) =>
                                    setSelectedRelatedVariants((prev) => ({
                                      ...prev,
                                      [related.id]: e.target.value,
                                    }))
                                  }
                                >
                                  {related.purchasableVariants.map((v) => (
                                    <option key={v.id} value={v.id}>
                                      {v.size_label} - $
                                      {Number(v.price).toFixed(2)}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <p className="font-mono text-[10px] text-gray-500 mt-2 uppercase font-bold">
                                  {rVariant?.size_label} • $
                                  {Number(rVariant?.price || 0).toFixed(2)}
                                </p>
                              )}
                            </div>
                          </Link>

                          <button
                            onClick={() => handleAddRelated(related)}
                            disabled={!rVariant}
                            className="w-full bg-[#1b1b1b] text-white font-oswald uppercase tracking-widest text-xs py-2 hover:bg-[#ce2a34] transition-colors flex items-center justify-center gap-2 rounded-sm"
                          >
                            <PlusCircle size={14} /> Add to Cart
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* --- RICH DESCRIPTION SECTION --- */}
            {product.description ? (
              <div className="description-container border-t-2 border-gray-100 pt-8">
                <h3 className="font-oswald text-xl uppercase border-b-2 border-[#ce2a34] inline-block mb-6 pb-1 text-[#1b1b1b]">
                  Product Description
                </h3>

                <div
                  className="product-rich-text font-body text-gray-600 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded border border-gray-200 text-center text-gray-500 font-body text-sm border-t-2 border-gray-100 mt-8">
                Detailed research information is available upon request.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
