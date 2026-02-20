import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../store/useCartStore';
import { SlidersHorizontal, X, Beer, Baby, PartyPopper } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Age Verification & POV States
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isDizzy, setIsDizzy] = useState(false);

  const [localMin, setLocalMin] = useState('');
  const [localMax, setLocalMax] = useState('');

  const {
    searchQuery, setSearchQuery,
    selectedCategory, setCategory,
    sortOrder, setSortOrder,
    minPrice, maxPrice, setPriceRange,
  } = useCartStore();

  const isLiquorMode = selectedCategory === "Liquor";

  const fetchProducts = useCallback(() => {
    if (products.length > 0) {
      setIsUpdating(true);
    } else {
      setLoading(true);
    }

    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
    if (sortOrder) params.append('ordering', sortOrder);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);

    axios.get(`http://127.0.0.1:8000/api/products/?${params.toString()}`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
        setIsUpdating(false);
      })
      .catch(err => {
        console.log("Backend error:", err);
        setLoading(false);
        setIsUpdating(false);
      });
  }, [selectedCategory, sortOrder, minPrice, maxPrice, products.length]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setSearchQuery('');
    setSortOrder('');
    setPriceRange('', '');
    setLocalMin('');
    setLocalMax('');
    
    // Safety: If they leave Liquor category, stop the dizziness immediately
    if (selectedCategory !== "Liquor") {
      setIsDizzy(false);
    }
  }, [selectedCategory, setSearchQuery, setSortOrder, setPriceRange]);

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return product.title.toLowerCase().includes(q);
  });

  const handleApplyPrice = () => {
    setPriceRange(localMin, localMax);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSortOrder('');
    setPriceRange('', '');
    setLocalMin('');
    setLocalMax('');
  };

  const hasActiveFilters = sortOrder || minPrice || maxPrice;

  // --- DIZZY POV HANDLERS ---
  const handleUnder18 = () => {
    setCategory("All"); 
    setIsAgeVerified(false);
    setIsDizzy(false);
  };

  const handleOver18 = () => {
    setIsAgeVerified(true);
    if (isLiquorMode) {
      setIsDizzy(true);
      // Dizzy for 4 seconds when first entering
      setTimeout(() => setIsDizzy(false), 4000);
    }
  };

  const handleExploreSpirits = () => {
    if (isLiquorMode) {
      setIsDizzy(true);
      // Dizzy hit for 3.5 seconds on button click
      setTimeout(() => setIsDizzy(false), 3500);
    }
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading && products.length === 0) return (
    <div className={`flex flex-col justify-center items-center h-[60vh] transition-colors duration-500 ${isLiquorMode ? 'bg-gray-950' : 'bg-white'}`}>
      <div className={`w-12 h-12 border-4 rounded-full animate-spin ${isLiquorMode ? 'border-purple-500 border-t-transparent' : 'border-blue-600 border-t-transparent'}`}></div>
    </div>
  );

  return (
    <div className={`w-full transition-all duration-700 min-h-screen relative overflow-x-hidden ${isLiquorMode ? 'bg-gray-950 text-white' : 'bg-white'} ${isDizzy ? 'animate-dizzy' : ''}`}>
      
      {/* DIZZY POV KEYFRAMES */}
      <style>{`
        @keyframes dizzy {
          0% { transform: scale(1) rotate(0deg); filter: blur(0px); }
          25% { transform: scale(1.02) rotate(1.2deg) translateX(8px); filter: blur(1.2px); }
          50% { transform: scale(0.99) rotate(-0.8deg) translateY(5px); filter: blur(0.5px); }
          75% { transform: scale(1.01) rotate(1.5deg) translateX(-8px); filter: blur(1.8px); }
          100% { transform: scale(1) rotate(0deg); filter: blur(0px); }
        }
        .animate-dizzy {
          animation: dizzy 3.5s ease-in-out infinite;
          transform-origin: center;
          pointer-events: none; /* Helps prevent accidental clicks while moving */
          pointer-events: auto; 
        }
      `}</style>

      {/* FUN AGE VERIFICATION POPUP */}
      {isLiquorMode && !isAgeVerified && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[20px] transition-all"></div>
          
          <div className="relative bg-zinc-900 border-2 border-purple-500/30 p-10 rounded-[3.5rem] max-w-lg w-full text-center shadow-[0_0_50px_rgba(168,85,247,0.2)] animate-in zoom-in duration-300">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-purple-600 blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative bg-gradient-to-tr from-purple-600 to-pink-500 w-full h-full rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-3">
                <Beer size={44} className="text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400">
              Hold Up, Legend! ✋
            </h2>
            
            <p className="text-purple-400 font-bold text-[10px] tracking-[0.3em] uppercase mb-6">
                Jhyapp hune umer bhayo?
            </p>

            <p className="text-gray-400 mb-10 leading-relaxed font-medium px-4">
              This section is for the veterans only. Are you <span className="text-white font-bold underline decoration-purple-500">18+</span> or should we call your mom?
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleOver18}
                className="group relative overflow-hidden px-8 py-5 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  I'm a grown up. Let's go! <PartyPopper size={18} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <button 
                onClick={handleUnder18}
                className="px-8 py-5 rounded-2xl bg-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-widest hover:text-white hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
              >
                <Baby size={16} /> Take me back to ZappStore
              </button>
            </div>
            
            <p className="mt-10 text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-black">
              * Drink Responsibly • JhyappStore Nepal *
            </p>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      {!searchQuery && (selectedCategory === "All" || selectedCategory === "Liquor") && (
        <section className={`w-full transition-all duration-700 relative overflow-hidden ${isLiquorMode ? 'bg-gradient-to-br from-gray-900 via-black to-purple-950 text-white' : 'bg-gradient-to-r from-blue-700 to-blue-500 text-white'}`}>
          {isLiquorMode && (
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full -mr-20 -mt-20"></div>
          )}
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10">
            <div className="max-w-3xl">
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block transition-colors ${isLiquorMode ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-yellow-400 text-blue-900'}`}>
                {isLiquorMode ? "Premium Spirits Collection" : "Free Shipping on All Orders"}
              </span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
                {isLiquorMode ? (
                  <>Experience the <span className="text-purple-400 italic">Night</span> Being Jhyapp</>
                ) : (
                  <>Discover Tomorrow's <span className="text-yellow-400">Style</span> Today</>
                )}
              </h1>
              <p className={`text-lg md:text-xl mb-10 opacity-90 max-w-xl ${isLiquorMode ? 'text-purple-100' : 'text-blue-100'}`}>
                {isLiquorMode
                  ? "Explore our curated selection of fine wines and premium liquors. Perfect for the moments that matter."
                  : "Shop curated electronics, jewelry, and fashion with lightning-fast delivery and secure checkout."}
              </p>
              <button
                onClick={handleExploreSpirits}
                className={`px-10 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-xl ${isLiquorMode ? 'bg-purple-600 text-white shadow-purple-500/20 hover:bg-purple-500' : 'bg-yellow-400 text-blue-900 shadow-yellow-400/30'}`}
              >
                {isLiquorMode ? "Explore Spirits" : "Shop Now"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTS SECTION */}
      <section id="products-section" className="max-w-7xl mx-auto px-6 py-12">
        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h2 className={`text-4xl font-black italic tracking-tighter uppercase transition-colors ${isLiquorMode ? 'text-purple-400' : 'text-gray-900'}`}>
              {searchQuery ? `Results for "${searchQuery}"` : selectedCategory === "All" ? "Trending Now" : selectedCategory}
            </h2>
            <span className={`text-sm font-bold ${isLiquorMode ? 'text-purple-300/60' : 'text-gray-400'}`}>
              {filteredProducts.length} items
            </span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border outline-none cursor-pointer transition-all ${isLiquorMode ? 'bg-gray-900 text-white border-gray-700 focus:border-purple-500' : 'bg-white text-gray-700 border-gray-200 focus:border-blue-400'}`}
            >
              <option value="">Sort: Default</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name_asc">Name: A → Z</option>
              <option value="rating">Top Rated</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                hasActiveFilters
                  ? (isLiquorMode ? 'bg-purple-600 text-white border-purple-600' : 'bg-blue-600 text-white border-blue-600')
                  : (isLiquorMode ? 'bg-gray-900 text-gray-400 border-gray-700 hover:border-purple-500' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400')
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-white rounded-full"></span>}
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all ${isLiquorMode ? 'text-purple-400 hover:bg-gray-900' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <X size={13} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* FILTER PANEL */}
        {showFilters && (
          <div className={`mb-8 p-6 rounded-2xl border transition-all ${isLiquorMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
            <p className={`text-xs font-black uppercase tracking-widest mb-4 ${isLiquorMode ? 'text-gray-400' : 'text-gray-500'}`}>Price Range</p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${isLiquorMode ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={localMin}
                  onChange={e => setLocalMin(e.target.value)}
                  className={`w-28 px-4 py-2 rounded-xl text-sm font-bold border outline-none ${isLiquorMode ? 'bg-gray-800 text-white border-gray-700 focus:border-purple-500' : 'bg-white border-gray-200 focus:border-blue-400'}`}
                />
              </div>
              <span className={`font-bold ${isLiquorMode ? 'text-gray-600' : 'text-gray-300'}`}>—</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${isLiquorMode ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={localMax}
                  onChange={e => setLocalMax(e.target.value)}
                  className={`w-28 px-4 py-2 rounded-xl text-sm font-bold border outline-none ${isLiquorMode ? 'bg-gray-800 text-white border-gray-700 focus:border-purple-500' : 'bg-white border-gray-200 focus:border-blue-400'}`}
                />
              </div>
              <button
                onClick={handleApplyPrice}
                className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${isLiquorMode ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-blue-600 text-white hover:bg-black'}`}
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* PRODUCT GRID */}
        <div className="relative min-h-[400px]">
          {isUpdating && (
            <div className="absolute inset-0 z-20 flex justify-center pt-20 bg-inherit/30 backdrop-blur-[1px]">
               <div className={`w-10 h-10 border-4 rounded-full animate-spin ${isLiquorMode ? 'border-purple-500' : 'border-blue-600'} border-t-transparent`}></div>
            </div>
          )}

          {filteredProducts.length > 0 ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 transition-opacity duration-300 ${isUpdating ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-400">
                {searchQuery ? `No results for "${searchQuery}"` : `No ${selectedCategory} products found.`}
              </h3>
              <button
                onClick={() => { setCategory("All"); handleClearFilters(); }}
                className={`mt-4 font-bold underline ${isLiquorMode ? 'text-purple-400' : 'text-blue-600'}`}
              >
                Clear all filters
              </button>
            </div>  
          )}
        </div>
      </section>
    </div>
  );
}