import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Package,
  Loader2,
  Upload,
  Save,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State (For creating a NEW product)
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Peptides");
  const [newPrice, setNewPrice] = useState("");
  const [newSize, setNewSize] = useState("Standard");
  const [newStock, setNewStock] = useState(true);
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select(`*, variants (*)`)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching products:", error);
    else setProducts(data || []);
    setLoading(false);
  }

  // --- IMAGE COMPRESSION & UPLOAD ---
  async function handleImageUpload(file) {
    if (!file) return null;

    try {
      setUploading(true);
      const compressedFile = await compressImage(file);
      const fileExt = "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      alert("Upload failed: " + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  }

  function compressImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) =>
              resolve(new File([blob], file.name, { type: "image/jpeg" })),
            "image/jpeg",
            0.8,
          );
        };
      };
    });
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
        image_url: newImage,
      })
      .select()
      .single();

    if (error) return alert("Error creating product: " + error.message);

    // 2. Create Default Variant
    const { error: variantError } = await supabase.from("variants").insert({
      product_id: prod.id,
      size_label: newSize,
      price: parseFloat(newPrice),
      in_stock: true,
    });

    if (variantError) alert("Error creating variant: " + variantError.message);

    setIsAdding(false);
    setNewName("");
    setNewPrice("");
    setNewSize("Standard");
    setNewImage("");
    fetchProducts();
  }

  async function handleDelete(id) {
    if (
      !window.confirm("Delete product and ALL variants? This cannot be undone.")
    )
      return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  }

  return (
    <div className="bg-white rounded shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="font-oswald text-xl md:text-2xl uppercase text-[#1b1b1b]">
          Inventory Management
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#ce2a34] text-white px-4 py-2 rounded font-oswald uppercase tracking-widest text-sm hover:bg-[#1b1b1b] transition-colors flex items-center gap-2"
        >
          {isAdding ? (
            "Cancel"
          ) : (
            <>
              <Plus size={16} /> Add Product
            </>
          )}
        </button>
      </div>

      {/* Add Product Form */}
      {isAdding && (
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="font-oswald uppercase text-[#1b1b1b] text-lg mb-4">
            New Product Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 font-body text-sm">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Product Name
              </label>
              <input
                placeholder="e.g. BPC-157"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:border-[#ce2a34] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:border-[#ce2a34] outline-none bg-white"
              >
                <option>Peptides</option>
                <option>Peptide Blends</option>
                <option>Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Initial Size / Variant
              </label>
              <input
                placeholder="e.g. 5mg, 10ml, Standard"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:border-[#ce2a34] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Initial Price (AUD)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:border-[#ce2a34] outline-none"
              />
            </div>

            {/* Image Upload Input */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Product Image
              </label>
              <div className="flex items-center gap-3">
                <input
                  placeholder="Paste Image URL or Upload..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:border-[#ce2a34] outline-none"
                />
                <label className="cursor-pointer bg-[#1b1b1b] text-white hover:bg-[#ce2a34] p-3 rounded border border-transparent transition-colors flex items-center justify-center min-w-[48px]">
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={async (e) => {
                      const url = await handleImageUpload(e.target.files[0]);
                      if (url) setNewImage(url);
                    }}
                  />
                  {uploading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Upload size={20} />
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="stockStatus"
              checked={newStock}
              onChange={(e) => setNewStock(e.target.checked)}
              className="w-4 h-4 accent-[#ce2a34]"
            />
            <label
              htmlFor="stockStatus"
              className="text-sm font-bold text-gray-700 uppercase"
            >
              Product is In Stock
            </label>
          </div>

          {newImage && (
            <div className="mb-6 p-2 bg-white border border-gray-200 rounded inline-block">
              <img
                src={newImage}
                alt="Preview"
                className="h-24 w-24 object-contain"
              />
            </div>
          )}

          <div className="flex justify-end border-t border-gray-200 pt-4">
            <button
              onClick={handleCreate}
              className="bg-[#ce2a34] text-white px-6 py-3 rounded font-oswald uppercase tracking-widest hover:bg-[#1b1b1b] transition-colors flex items-center gap-2 shadow-md"
            >
              <Save size={18} /> Save Product
            </button>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="p-4 md:p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-[#ce2a34]" size={32} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center p-12 text-gray-500 font-mono">
            No products found.
          </div>
        ) : (
          products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onDelete={() => handleDelete(product.id)}
              handleUpload={handleImageUpload}
              onRefresh={fetchProducts}
            />
          ))
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Product Row ---
function ProductRow({ product, onDelete, handleUpload, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Main Product States
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [inStock, setInStock] = useState(product.in_stock !== false);
  const [image, setImage] = useState(product.image_url);

  // Variant States (Array of variant objects)
  const [localVariants, setLocalVariants] = useState([]);
  const [variantsToDelete, setVariantsToDelete] = useState([]);

  // Reset local state if product changes (e.g. after refresh)
  useEffect(() => {
    setName(product.name);
    setCategory(product.category);
    setInStock(product.in_stock !== false);
    setImage(product.image_url);
    setLocalVariants(product.variants?.map((v) => ({ ...v })) || []);
    setVariantsToDelete([]);
  }, [product]);

  // Variant Helpers
  const addVariant = () => {
    setLocalVariants([
      ...localVariants,
      { size_label: "", price: 0, in_stock: true },
    ]);
  };

  const updateVariant = (index, field, value) => {
    const updated = [...localVariants];
    updated[index][field] = value;
    setLocalVariants(updated);
  };

  const removeVariant = (index) => {
    const variantToRemove = localVariants[index];
    if (variantToRemove.id) {
      setVariantsToDelete([...variantsToDelete, variantToRemove.id]);
    }
    const updated = localVariants.filter((_, i) => i !== index);
    setLocalVariants(updated);
  };

  async function handleSave() {
    setIsSaving(true);
    try {
      // 1. Update Product Details
      const { error: prodErr } = await supabase
        .from("products")
        .update({
          name,
          category,
          in_stock: inStock,
          image_url: image,
        })
        .eq("id", product.id);

      if (prodErr) throw prodErr;

      // 2. Delete removed variants
      if (variantsToDelete.length > 0) {
        const { error: delErr } = await supabase
          .from("variants")
          .delete()
          .in("id", variantsToDelete);
        if (delErr) throw delErr;
      }

      // 3. Upsert Variants
      const newVariants = [];
      for (const v of localVariants) {
        if (!v.size_label || isNaN(v.price)) continue; // skip invalid entries

        if (v.id) {
          // Update existing
          const { error: updErr } = await supabase
            .from("variants")
            .update({
              size_label: v.size_label,
              price: parseFloat(v.price),
              in_stock: v.in_stock !== false,
            })
            .eq("id", v.id);
          if (updErr) throw updErr;
        } else {
          // Insert new
          newVariants.push({
            product_id: product.id,
            size_label: v.size_label,
            price: parseFloat(v.price),
            in_stock: v.in_stock !== false,
          });
        }
      }

      if (newVariants.length > 0) {
        const { error: insErr } = await supabase
          .from("variants")
          .insert(newVariants);
        if (insErr) throw insErr;
      }

      onRefresh();
      setExpanded(false);
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setIsSaving(false);
    }
  }

  // Calculate display price
  const prices = localVariants.map((v) => v.price) || [0];
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const priceDisplay =
    minPrice === maxPrice
      ? `$${minPrice.toFixed(2)}`
      : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* ROW HEADER (Always Visible) */}
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-50 rounded flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <Package size={24} className="text-gray-300" />
            )}
          </div>
          <div>
            <h4 className="font-oswald text-lg text-[#1b1b1b] uppercase tracking-wide leading-none mb-2">
              {name}
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded uppercase">
                {category}
              </span>
              <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded uppercase">
                {localVariants.length} Variant(s)
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-1 rounded uppercase flex items-center gap-1 ${
                  inStock
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {inStock ? <CheckCircle size={10} /> : <XCircle size={10} />}
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
          <div className="text-right">
            <span className="font-oswald text-xl text-[#ce2a34]">
              {prices.length > 0 ? priceDisplay : "No Variants"}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-[#1b1b1b] hover:text-white transition-colors"
            >
              {expanded ? <ChevronUp size={20} /> : <EditIcon />}
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-red-50 text-red-500 rounded hover:bg-red-600 hover:text-white transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MENU (Expanded) */}
      {expanded && (
        <div className="bg-gray-50 p-4 md:p-6 border-t border-gray-200">
          {/* Main Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 font-body text-sm">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Product Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:border-[#ce2a34] outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:border-[#ce2a34] outline-none bg-white"
              >
                <option>Peptides</option>
                <option>Peptide Blends</option>
                <option>Accessories</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Image URL
              </label>
              <div className="flex gap-2">
                <input
                  value={image || ""}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:border-[#ce2a34] outline-none bg-white flex-1"
                  placeholder="https://..."
                />
                <label className="bg-[#1b1b1b] text-white p-3 rounded cursor-pointer hover:bg-[#ce2a34] transition-colors flex items-center justify-center w-12 shrink-0">
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={async (e) => {
                      setUploading(true);
                      const url = await handleUpload(e.target.files[0]);
                      if (url) setImage(url);
                      setUploading(false);
                    }}
                  />
                  {uploading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Upload size={18} />
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-oswald uppercase text-[#1b1b1b] text-sm tracking-wide">
                Variants / Sizes
              </h4>
              <button
                onClick={addVariant}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
              >
                <Plus size={14} /> Add Variant
              </button>
            </div>

            <div className="space-y-3">
              {localVariants.map((v, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white p-3 border border-gray-200 rounded shadow-sm"
                >
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                      Label / Size
                    </label>
                    <input
                      value={v.size_label}
                      onChange={(e) =>
                        updateVariant(i, "size_label", e.target.value)
                      }
                      placeholder="e.g. 5mg"
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:border-[#ce2a34] outline-none"
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                      Price (AUD)
                    </label>
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) =>
                        updateVariant(i, "price", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:border-[#ce2a34] outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2 sm:pt-4">
                    <input
                      type="checkbox"
                      checked={v.in_stock !== false}
                      onChange={(e) =>
                        updateVariant(i, "in_stock", e.target.checked)
                      }
                      className="w-4 h-4 accent-[#ce2a34]"
                    />
                    <span className="text-xs font-bold text-gray-600 uppercase">
                      In Stock
                    </span>
                  </div>
                  <div className="pt-1 sm:pt-4 flex justify-end">
                    <button
                      onClick={() => removeVariant(i)}
                      className="p-2 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                      title="Remove Variant"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {localVariants.length === 0 && (
                <p className="text-xs text-gray-500 font-mono italic">
                  No variants added. Product will not be purchasable.
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 bg-white p-3 border border-gray-200 rounded w-full md:w-auto shadow-sm">
              <input
                type="checkbox"
                id={`stock-${product.id}`}
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 accent-[#ce2a34]"
              />
              <label
                htmlFor={`stock-${product.id}`}
                className="text-sm font-bold text-[#1b1b1b] uppercase cursor-pointer"
              >
                Global Product Enabled
              </label>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#ce2a34] text-white px-6 py-3 rounded hover:bg-[#1b1b1b] text-sm font-oswald uppercase tracking-widest transition-colors shadow-md disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>
  );
}
