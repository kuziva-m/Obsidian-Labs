import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import {
  Plus,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  Package,
  Loader2,
} from "lucide-react";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Peptides");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    // Fetch products AND their variants
    const { data, error } = await supabase
      .from("products")
      .select(`*, variants (*)`)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching products:", error);
    else setProducts(data || []);
    setLoading(false);
  }

  async function handleCreate() {
    if (!newName || !newPrice) return alert("Name and Price are required");

    // 1. Create Parent Product
    const { data: prod, error } = await supabase
      .from("products")
      .insert({
        name: newName,
        category: newCategory,
        in_stock: newStock,
      })
      .select()
      .single();

    if (error) return alert("Error creating product: " + error.message);

    // 2. Create Default Variant (Standard Size)
    const { error: variantError } = await supabase.from("variants").insert({
      product_id: prod.id,
      size_label: "Standard",
      price: parseFloat(newPrice),
    });

    if (variantError) alert("Error creating variant: " + variantError.message);

    // Reset Form
    setIsAdding(false);
    setNewName("");
    setNewPrice("");
    fetchProducts();
  }

  async function handleDelete(id) {
    if (
      !confirm("Are you sure? This will delete the product and its variants.")
    )
      return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) alert("Error deleting: " + error.message);
    else fetchProducts();
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--baltic-sea)]">
            Product Inventory
          </h1>
          <p className="text-gray-500">Manage your catalog and pricing</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[var(--brick-red)] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[var(--old-brick)] transition-colors flex items-center gap-2"
        >
          {isAdding ? (
            "Cancel"
          ) : (
            <>
              <Plus size={18} /> Add Product
            </>
          )}
        </button>
      </div>

      {/* Add Product Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-bold text-lg mb-4 text-[var(--baltic-sea)]">
            New Product Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                PRODUCT NAME
              </label>
              <input
                placeholder="e.g. BPC-157"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[var(--brick-red)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                CATEGORY
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[var(--brick-red)] bg-white"
              >
                <option>Peptides</option>
                <option>Peptide Blends</option>
                <option>Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                PRICE (AUD)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[var(--brick-red)]"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleCreate}
              className="bg-[var(--baltic-sea)] text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors"
            >
              Save Product
            </button>
          </div>
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin mx-auto text-gray-400" size={32} />
          <p className="text-gray-500 mt-4">Loading inventory...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <Package className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">
            No products found. Start by adding one.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onDelete={() => handleDelete(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductRow({ product, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  // Get the first variant's price to display as the "main" price
  const mainPrice =
    product.variants && product.variants.length > 0
      ? product.variants[0].price
      : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            <Package size={20} />
          </div>
          <div>
            <h4 className="font-bold text-[var(--baltic-sea)]">
              {product.name}
            </h4>
            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded mt-1">
              {product.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <div className="font-bold text-[var(--brick-red)]">
              ${mainPrice}
            </div>
            <div className="text-xs text-gray-400">Standard Price</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 text-gray-400 hover:text-[var(--baltic-sea)] transition-colors"
            >
              {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-400 hover:text-red-600 transition-colors"
              title="Delete Product"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="bg-gray-50 p-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1 font-semibold text-xs">
                PRODUCT ID
              </p>
              <code className="bg-white px-2 py-1 rounded border border-gray-200 text-xs block w-full">
                {product.id}
              </code>
            </div>
            <div>
              <p className="text-gray-500 mb-1 font-semibold text-xs">STATUS</p>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${product.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {product.in_stock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div className="col-span-1 md:col-span-2 mt-2">
              <p className="text-gray-500 mb-2 font-semibold text-xs">
                VARIANTS
              </p>
              {product.variants?.map((v, i) => (
                <div
                  key={v.id || i}
                  className="flex justify-between items-center bg-white p-2 rounded border border-gray-200 mb-2"
                >
                  <span>{v.size_label}</span>
                  <span className="font-mono font-medium">${v.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
