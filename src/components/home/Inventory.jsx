import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ShoppingCart } from "lucide-react";

export default function Inventory() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase.from("products").select("*").limit(4);
      if (data) setProducts(data);
    }
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-[#f4f4f5]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-[Oswald] text-4xl uppercase text-[var(--baltic-sea)]">
              Latest Arrivals
            </h2>
            <p className="font-mono text-gray-500 mt-2">
              // RECENTLY RESTOCKED INVENTORY
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden md:block font-[Oswald] uppercase text-[var(--brick-red)] border-b-2 border-[var(--brick-red)] hover:text-black hover:border-black transition-all"
          >
            View All Stock
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/shop`}
              className="group block bg-white border-2 border-transparent hover:border-[var(--baltic-sea)] p-4 transition-all"
            >
              <div className="aspect-square bg-gray-100 mb-4 relative overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-[Oswald] text-gray-300 text-2xl -rotate-12">
                    NO IMG
                  </div>
                )}
              </div>

              <h3 className="font-[Oswald] text-lg uppercase leading-tight text-[var(--baltic-sea)] mb-1">
                {product.name}
              </h3>

              <div className="flex justify-between items-center mt-2">
                <span className="font-mono text-xs text-gray-500">
                  {product.category}
                </span>
                <ShoppingCart
                  size={16}
                  className="text-[var(--brick-red)] opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/shop"
            className="font-[Oswald] uppercase bg-[var(--baltic-sea)] text-white px-6 py-3 text-sm tracking-widest"
          >
            View All Stock
          </Link>
        </div>
      </div>
    </section>
  );
}
