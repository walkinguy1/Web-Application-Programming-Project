import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../store/useCartStore'; 

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get search and category states from the global store
  const { searchQuery, selectedCategory, setCategory, setSearchQuery } = useCartStore();

  // Define your categories - these should match the 'category' field in your Django models
  const categories = ["All", "Electronics", "Jewelry", "Men's Clothing", "Women's Clothing"];

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products/') 
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log("Backend error:", err);
        setLoading(false);
      });
  }, []);

  // LOGIC: Filter products based on BOTH Category and Search Query
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full">
      {/* HERO SECTION - Only show when NOT searching and on "All" category */}
      {!searchQuery && selectedCategory === "All" && (
        <section className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
            <div className="max-w-3xl">
              <span className="bg-yellow-400 text-blue-900 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">
                Free Shipping on All Orders
              </span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Discover Tomorrow's <span className="text-yellow-400">Style</span> Today
              </h1>
              <p className="text-blue-100 text-lg md:text-xl mb-10 opacity-90 max-w-xl">
                Shop curated electronics, jewelry, and fashion with lightning-fast delivery and secure checkout.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-yellow-400 text-blue-900 px-10 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-xl shadow-yellow-400/30">
                  Shop Now
                </button>
                <button className="border-2 border-white/40 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
                  View Collections
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CATEGORY BAR SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex flex-wrap items-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all border ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase">
            {searchQuery 
              ? `Results for "${searchQuery}"` 
              : selectedCategory === "All" ? "Trending Now" : selectedCategory
            }
          </h2>
          <div className="h-1 flex-1 bg-gray-100 mx-8 hidden md:block"></div>
          {(searchQuery || selectedCategory !== "All") && (
            <p className="text-gray-500 font-bold">{filteredProducts.length} items found</p>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-400">No products match your criteria.</h3>
            <button 
              onClick={() => {
                setSearchQuery("");
                setCategory("All");
              }}
              className="mt-4 text-blue-600 font-bold underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}