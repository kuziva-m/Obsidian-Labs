import { useEffect, useState, useMemo } from "react";
import { useCart } from "../lib/CartContext";
import {
  X,
  Minus,
  Plus,
  Trash2,
  Lock,
  ShoppingBag,
  PlusCircle,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getSuggestedProductSlugsForCart } from "../lib/productRelationships";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    addToCart,
  } = useCart();

  const navigate = useNavigate();

  // --- SUGGESTIONS STATE ---
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedSuggestedVariants, setSelectedSuggestedVariants] = useState(
    {},
  );

  // --- POPUP STATE ---
  const [showHolidayPopup, setShowHolidayPopup] = useState(false);

  // 1. Get the slugs we should suggest based on current cart
  const suggestedSlugs = useMemo(
    () => getSuggestedProductSlugsForCart(cart),
    [cart],
  );

  // 2. Fetch the suggested products from Supabase
  useEffect(() => {
    async function fetchSuggestedProducts() {
      if (!isCartOpen || suggestedSlugs.length === 0) {
        setSuggestedProducts([]);
        setSelectedSuggestedVariants({});
        return;
      }

      setLoadingSuggestions(true);

      const { data, error } = await supabase
        .from("products")
        .select("*, variants (*)")
        .in("slug", suggestedSlugs);

      if (error || !data) {
        setSuggestedProducts([]);
        setLoadingSuggestions(false);
        return;
      }

      // Filter and organize the data
      const hydrated = suggestedSlugs
        .map((slug) => data.find((item) => item.slug === slug))
        .filter(Boolean)
        .map((product) => {
          // Get variants that are not hidden and are in stock
          const purchasableVariants = (product.variants || [])
            .filter((v) => v.is_hidden !== true)
            .filter((v) => v.in_stock !== false)
            .sort((a, b) => (a.price || 0) - (b.price || 0));

          const defaultVariant = purchasableVariants[0] || null;

          return { ...product, purchasableVariants, defaultVariant };
        })
        .filter((product) => product.defaultVariant);

      // Set default selected variants for the dropdowns
      const nextSelectedVariants = {};
      hydrated.forEach((product) => {
        nextSelectedVariants[product.id] = product.defaultVariant.id;
      });

      setSuggestedProducts(hydrated);
      setSelectedSuggestedVariants(nextSelectedVariants);
      setLoadingSuggestions(false);
    }

    fetchSuggestedProducts();
  }, [isCartOpen, suggestedSlugs]);

  // --- ACTIONS ---
  const handleProceedToCheckout = () => {
    setShowHolidayPopup(false);
    setIsCartOpen(false);
    navigate("/checkout");
  };

  const handleAddSuggested = (product) => {
    if (!product?.purchasableVariants?.length) return;

    const selectedVariantId = selectedSuggestedVariants[product.id];

    // Safely compare IDs as strings
    const selectedVariant =
      product.purchasableVariants.find(
        (v) => String(v.id) === String(selectedVariantId),
      ) || product.defaultVariant;

    if (!selectedVariant) return;

    addToCart(
      {
        ...product,
        id: product.id,
        price: selectedVariant.price,
        image: selectedVariant.image_url || product.image_url,
        variantId: selectedVariant.id,
      },
      1,
      selectedVariant.size_label,
    );
  };

  const handleSuggestedVariantChange = (productId, variantId) => {
    setSelectedSuggestedVariants((prev) => ({
      ...prev,
      [productId]: variantId,
    }));
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[1001] flex justify-end">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="relative w-[85vw] md:w-full md:max-w-md h-full bg-white/95 backdrop-blur-md border-l-4 border-[var(--baltic-sea)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* HEADER */}
        <div className="p-6 bg-[var(--baltic-sea)] text-white flex justify-between items-center">
          <h2 className="font-[Oswald] text-2xl uppercase tracking-widest">
            Cart ({cart.length})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 -mr-2 text-white hover:text-[var(--brick-red)] transition-colors"
          >
            <X size={28} strokeWidth={2.5} />
          </button>
        </div>

        {/* SCROLLABLE CART CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {cart.length === 0 ? (
            <div className="text-center py-20 opacity-30 font-[Oswald] uppercase text-gray-500 tracking-widest">
              Your Cart is Empty
            </div>
          ) : (
            <>
              {/* CURRENT CART ITEMS */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.variantId}
                    className="bg-white border-2 border-gray-100 p-4 flex gap-4 shadow-sm"
                  >
                    <div className="w-20 h-20 bg-gray-50 border border-gray-200 flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-xs">
                          LABS
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-[Oswald] uppercase text-[var(--baltic-sea)] leading-tight mb-1 text-sm font-bold truncate">
                        {item.name}
                      </h3>
                      <p className="font-mono text-[10px] text-gray-400 mb-3 uppercase font-bold tracking-wide">
                        {item.sizeLabel} • ${item.price} / unit
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center border-2 border-[var(--baltic-sea)] bg-white">
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            className="px-2 py-1 hover:bg-gray-100 text-[var(--baltic-sea)]"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 font-mono text-sm font-bold text-[var(--baltic-sea)]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            className="px-2 py-1 hover:bg-gray-100 text-[var(--baltic-sea)]"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="text-gray-400 hover:text-[var(--brick-red)] transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* FREQUENTLY PAIRED TOGETHER */}
              {(loadingSuggestions || suggestedProducts.length > 0) && (
                <div className="mt-8 bg-[var(--brick-red)] p-5 rounded-sm shadow-md border-b-4 border-[var(--baltic-sea)]">
                  <h4 className="font-[Oswald] uppercase text-white text-lg tracking-widest mb-4 flex items-center gap-2">
                    <ShoppingBag size={18} className="text-white" />
                    Frequently Paired With
                  </h4>

                  {loadingSuggestions ? (
                    <div className="text-xs font-mono text-red-200 animate-pulse uppercase tracking-wider">
                      Analyzing optimal combinations...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {suggestedProducts.slice(0, 3).map((product) => {
                        const selectedVariantId =
                          selectedSuggestedVariants[product.id];
                        const selectedVariant =
                          product.purchasableVariants.find(
                            (v) => String(v.id) === String(selectedVariantId),
                          ) || product.defaultVariant;

                        return (
                          <div
                            key={product.id}
                            className="bg-white border-2 border-[var(--baltic-sea)] p-3 flex gap-3 items-center rounded-sm shadow-sm"
                          >
                            <Link
                              to={`/product/${product.slug}`}
                              onClick={() => setIsCartOpen(false)}
                              className="w-14 h-14 bg-gray-50 border border-gray-200 flex-shrink-0 flex items-center justify-center rounded-sm overflow-hidden"
                            >
                              <img
                                src={
                                  selectedVariant?.image_url ||
                                  product.image_url
                                }
                                alt={product.name}
                                className="w-full h-full object-cover p-1 hover:scale-110 transition-transform"
                              />
                            </Link>

                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/product/${product.slug}`}
                                onClick={() => setIsCartOpen(false)}
                                className="font-[Oswald] text-sm uppercase text-[var(--baltic-sea)] truncate block hover:text-[var(--brick-red)] leading-tight"
                              >
                                {product.name}
                              </Link>

                              {product.purchasableVariants.length > 1 ? (
                                <select
                                  className="w-full mt-1.5 bg-gray-50 border border-gray-200 font-mono text-[10px] p-1.5 text-[#1b1b1b] outline-none font-bold uppercase cursor-pointer hover:border-gray-400 transition-colors"
                                  value={selectedVariant?.id || ""}
                                  onChange={(e) =>
                                    handleSuggestedVariantChange(
                                      product.id,
                                      e.target.value,
                                    )
                                  }
                                >
                                  {product.purchasableVariants.map(
                                    (variant) => (
                                      <option
                                        key={variant.id}
                                        value={variant.id}
                                      >
                                        {variant.size_label} - $
                                        {Number(variant.price).toFixed(2)}
                                      </option>
                                    ),
                                  )}
                                </select>
                              ) : (
                                <p className="font-mono text-[10px] text-gray-500 mt-1.5 uppercase font-bold tracking-wide">
                                  {selectedVariant?.size_label} • $
                                  {Number(selectedVariant?.price).toFixed(2)}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => handleAddSuggested(product)}
                              disabled={!selectedVariant}
                              className="p-3 bg-[var(--baltic-sea)] text-white hover:bg-[var(--brick-red)] transition-colors flex-shrink-0 rounded-sm shadow-sm active:scale-95"
                              title="Add to Cart"
                            >
                              <PlusCircle size={18} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-white border-t-2 border-[var(--baltic-sea)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-end mb-6 font-[Oswald] text-xl uppercase text-[var(--baltic-sea)]">
            <span className="text-sm text-gray-500 tracking-widest">
              Subtotal
            </span>
            <span className="text-[var(--brick-red)] font-bold text-3xl">
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => setShowHolidayPopup(true)}
            disabled={cart.length === 0}
            className="w-full bg-[var(--baltic-sea)] text-white py-5 font-[Oswald] uppercase tracking-widest text-lg hover:bg-[var(--brick-red)] transition-all flex items-center justify-center gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <Lock size={18} /> Place Order
          </button>
        </div>
      </div>

      {/* HOLIDAY CHECKOUT POPUP */}
      {showHolidayPopup && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full rounded-sm shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 border-2 border-[var(--baltic-sea)]">
            <div className="bg-white p-6 text-center border-b-4 border-[var(--brick-red)] flex flex-col items-center">
              <img
                src="/assets/obsidian-logo-red.png"
                alt="Obsidian Labs"
                className="h-12 mb-3"
              />
              <h2 className="font-[Oswald] text-2xl md:text-3xl text-[var(--baltic-sea)] uppercase tracking-widest">
                Holiday Notice
              </h2>
            </div>
            <div className="p-6 md:p-8 text-center bg-gray-50">
              <p className="font-body text-gray-700 text-[1.1rem] leading-relaxed">
                Please note that all orders placed between{" "}
                <strong className="text-[var(--baltic-sea)]">
                  23 April and 2 May
                </strong>{" "}
                will be processed and shipped on{" "}
                <strong className="text-[var(--brick-red)]">3 May</strong>.
              </p>
            </div>
            <div className="p-4 bg-white border-t border-gray-200 flex flex-col gap-3">
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[var(--baltic-sea)] text-white py-4 font-[Oswald] uppercase tracking-widest text-sm hover:bg-[var(--brick-red)] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none"
              >
                I Understand & Proceed
              </button>
              <button
                onClick={() => setShowHolidayPopup(false)}
                className="w-full bg-gray-100 text-gray-600 py-3 font-[Oswald] uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
