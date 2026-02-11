import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Check, FlaskConical } from "lucide-react";
import { useCart } from "../lib/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product, loading }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // 1. Sort variants by price (Low to High)
  const sortedVariants =
    product?.variants?.sort((a, b) => a.price - b.price) || [];

  const [selectedVariant, setSelectedVariant] = useState(null);

  // 2. Initialize selected variant (Default to first available)
  useEffect(() => {
    if (sortedVariants.length > 0) {
      setSelectedVariant(sortedVariants[0]);
    }
  }, [product]);

  // SKELETON LOADING STATE
  if (loading || !product) {
    return (
      <div className="product-card skeleton-card">
        <div className="skeleton-img"></div>
        <div className="card-content-skeleton">
          <div className="skeleton-line w-3/4"></div>
          <div className="skeleton-line w-1/2"></div>
          <div className="skeleton-btn-box"></div>
        </div>
      </div>
    );
  }

  const isOutOfStock = !product.in_stock;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevents navigating to product page when clicking buttons
    e.stopPropagation();

    if (isOutOfStock || !selectedVariant) return;

    // Create a unique cart item based on the selected variant
    const itemToAdd = {
      ...product,
      variantId: selectedVariant.id,
      price: parseFloat(selectedVariant.price),
      sizeLabel: selectedVariant.size_label,
    };

    addToCart(itemToAdd);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-card group">
      {/* Link the image area to the Product Page */}
      <Link to={`/product/${product.id}`} className="card-image-wrapper">
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
      </Link>

      <div className="card-info">
        <div className="card-header">
          <span className="category-tag">{product.category}</span>
          {product.short_name && (
            <span className="ref-code">REF: {product.short_name}</span>
          )}
        </div>

        <h3 className="product-name font-oswald">{product.name}</h3>

        {/* --- VARIANT SELECTOR ROW --- */}
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

        {/* --- PRICE & ACTION --- */}
        <div className="action-row">
          <div className="price-box">
            <span className="price-label">PRICE</span>
            <span className="price-value font-oswald">
              ${selectedVariant ? selectedVariant.price : "0"}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
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
    </div>
  );
}
