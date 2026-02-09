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
  Upload,
  Image as ImageIcon,
  Save,
} from "lucide-react";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Peptides");
  const [newPrice, setNewPrice] = useState("");
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

      // 1. Compress Image (Client-side)
      const compressedFile = await compressImage(file);

      // 2. Upload to Supabase
      const fileExt = "jpg"; // We convert everything to JPG
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // 3. Get Public URL
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

  // Helper: Compress Image using Canvas
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
            (blob) => {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            },
            "image/jpeg",
            0.8,
          ); // 80% Quality
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
      size_label: "Standard",
      price: parseFloat(newPrice),
    });

    if (variantError) alert("Error creating variant: " + variantError.message);

    setIsAdding(false);
    setNewName("");
    setNewPrice("");
    setNewImage("");
    fetchProducts();
  }

  async function handleDelete(id) {
    if (!confirm("Delete product and all variants?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--baltic-sea)]">
            Inventory
          </h1>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary">
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
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <h3 className="font-bold text-lg mb-4">New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              placeholder="Product Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input-field"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="input-field bg-white"
            >
              <option>Peptides</option>
              <option>Peptide Blends</option>
              <option>Accessories</option>
            </select>
            <input
              type="number"
              placeholder="Price (AUD)"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="input-field"
            />

            {/* Image Upload Input */}
            <div className="flex items-center gap-3">
              <input
                placeholder="Image URL (optional)"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="input-field flex-1"
              />
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-3 rounded-lg border border-gray-300 transition-colors">
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

          {newImage && (
            <div className="mb-4">
              <img
                src={newImage}
                alt="Preview"
                className="h-20 w-20 object-cover rounded border border-gray-200"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={handleCreate} className="btn-primary">
              Save Product
            </button>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="space-y-4">
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onDelete={() => handleDelete(product.id)}
            handleUpload={handleImageUpload}
          />
        ))}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Product Row ---
function ProductRow({ product, onDelete, handleUpload }) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState(product.name);
  const [image, setImage] = useState(product.image_url);
  const [uploading, setUploading] = useState(false);

  const mainPrice = product.variants?.[0]?.price || 0;

  async function handleSave() {
    await supabase
      .from("products")
      .update({ name, image_url: image })
      .eq("id", product.id);
    alert("Saved!");
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package size={20} className="text-gray-400" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-[var(--baltic-sea)]">{name}</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-bold text-[var(--brick-red)]">
            ${mainPrice}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-gray-400 hover:text-black"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-400 hover:text-red-600"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="bg-gray-50 p-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                NAME
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">
                IMAGE
              </label>
              <div className="flex gap-2">
                <input
                  value={image || ""}
                  onChange={(e) => setImage(e.target.value)}
                  className="input-field bg-white flex-1"
                  placeholder="https://..."
                />
                <label className="bg-white border border-gray-300 p-2 rounded cursor-pointer hover:bg-gray-100 flex items-center justify-center w-12">
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
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Upload size={16} />
                  )}
                </label>
              </div>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[var(--baltic-sea)] text-white px-4 py-2 rounded hover:bg-black text-sm font-bold"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
