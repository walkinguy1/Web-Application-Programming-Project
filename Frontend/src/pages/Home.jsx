import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../store/useCartStore'; 

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { searchQuery, selectedCategory, setCategory, setSearchQuery } = useCartStore();

  const categories = ["All", "Electronics", "Jewelry", "Men's Clothing", "Women's Clothing", "Liquor"];

  // Theme check
  const isLiquorMode = selectedCategory === "Liquor";

  useEffect(() => {
    // Fetch from your Django API
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

  // IMPROVED FILTER LOGIC
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Normalize both strings to lowercase for "Electronics" vs "electronics" match
    const matchesCategory = 
      selectedCategory === "All" || 
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className={`flex flex-col justify-center items-center h-[60vh] transition-colors duration-500 ${isLiquorMode ? 'bg-gray-950' : 'bg-white'}`}>
      <div className={`w-12 h-12 border-4 rounded-full animate-spin ${
        isLiquorMode ? 'border-purple-500 border-t-transparent' : 'border-blue-600 border-t-transparent'
      }`}></div>
    </div>
  );

  return (
    <div className={`w-full transition-colors duration-700 min-h-screen ${isLiquorMode ? 'bg-gray-950 text-white' : 'bg-white'}`}>
      
      {/* HERO SECTION - Only show when "All" is selected */}
      {!searchQuery && selectedCategory === "All" && (
        <section className={`w-full transition-all duration-700 relative overflow-hidden ${
          isLiquorMode 
            ? 'bg-gradient-to-br from-gray-900 via-black to-purple-950 text-white' 
            : 'bg-gradient-to-r from-blue-700 to-blue-500 text-white'
        }`}>
          {isLiquorMode && (
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full -mr-20 -mt-20"></div>
          )}

          <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10">
            <div className="max-w-3xl">
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block transition-colors ${
                isLiquorMode ? 'bg-purple-600 text-white' : 'bg-yellow-400 text-blue-900'
              }`}>
                {isLiquorMode ? "Premium Spirits Collection" : "Free Shipping on All Orders"}
              </span>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
                {isLiquorMode ? (
                  <>Experience the <span className="text-purple-400 italic neon-purple">Night</span> with Jhapp</>
                ) : (
                  <>Discover Tomorrow's <span className="text-yellow-400">Style</span> Today</>
                )}
              </h1>

              <p className={`text-lg md:text-xl mb-10 opacity-90 max-w-xl ${isLiquorMode ? 'text-purple-100' : 'text-blue-100'}`}>
                {isLiquorMode 
                  ? "Explore our curated selection of fine wines and premium liquors. Perfect for the moments that matter."
                  : "Shop curated electronics, jewelry, and fashion with lightning-fast delivery and secure checkout."}
              </p>

              <div className="flex flex-wrap gap-4">
                <button className={`px-10 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-xl ${
                  isLiquorMode 
                    ? 'bg-purple-600 text-white shadow-purple-500/20 hover:bg-purple-500' 
                    : 'bg-yellow-400 text-blue-900 shadow-yellow-400/30'
                }`}>
                  {isLiquorMode ? "Explore Spirits" : "Shop Now"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CATEGORY BAR */}
      <section className="max-w-7xl mx-auto px-6 pt-10">
        <div className="flex flex-wrap items-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all border ${
                selectedCategory === cat
                  ? (isLiquorMode 
                      ? "bg-purple-600 text-white border-purple-600 shadow-lg" 
                      : "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200")
                  : (isLiquorMode
                      ? "bg-gray-900 text-gray-400 border-gray-800 hover:border-purple-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-400")
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <h2 className={`text-4xl font-black italic tracking-tighter uppercase transition-colors ${
            isLiquorMode ? 'text-purple-400 neon-purple' : 'text-gray-900'
          }`}>
            {searchQuery 
              ? `Results for "${searchQuery}"` 
              : selectedCategory === "All" ? "Trending Now" : selectedCategory
            }
          </h2>
          <div className={`h-1 flex-1 mx-8 hidden md:block ${isLiquorMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
          <p className={isLiquorMode ? 'text-purple-300/60' : 'text-gray-500'}>
            {filteredProducts.length} items found
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-400">No {selectedCategory} products found.</h3>
            <button 
              onClick={() => setCategory("All")}
              className={`mt-4 font-bold underline ${isLiquorMode ? 'text-purple-400' : 'text-blue-600'}`}
            >
              Back to All Products
            </button>
          </div>
        )}
      </section>
    </div>
  );
}