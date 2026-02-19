import React, { useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../store/useCartStore';
import { SlidersHorizontal, X } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [localMin, setLocalMin] = useState('');
  const [localMax, setLocalMax] = useState('');

  const {
    searchQuery, setSearchQuery,
    selectedCategory, setCategory,
    sortOrder, setSortOrder,
    minPrice, maxPrice, setPriceRange,
  } = useCartStore();

  const categories = ["All", "Electronics", "Jewelry", "Men's Clothing", "Women's Clothing", "Liquor"];
  const isLiquorMode = selectedCategory === "Liquor";

  // Fetch is only triggered by category, sort, and price — NOT search
  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
    if (sortOrder) params.append('ordering', sortOrder);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);

    axios.get(`http://127.0.0.1:8000/api/products/?${params.toString()}`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log("Backend error:", err);
        setLoading(false);
      });
  }, [selectedCategory, sortOrder, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Clear search and filters when category changes
  useEffect(() => {
    setSearchQuery('');
    setSortOrder('');
    setPriceRange('', '');
    setLocalMin('');
    setLocalMax('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Search filters the already-loaded products in memory — no API call, no blink
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      product.title.toLowerCase().includes(q) ||
      product.description?.toLowerCase().includes(q)
    );
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

  if (loading) return (
    <div className={`flex flex-col justify-center items-center h-[60vh] transition-colors duration-500 ${isLiquorMode ? 'bg-gray-950' : 'bg-white'}`}>
      <div className={`w-12 h-12 border-4 rounded-full animate-spin ${isLiquorMode ? 'border-purple-500 border-t-transparent' : 'border-blue-600 border-t-transparent'}`}></div>
    </div>
  );

  return (
    <div className={`w-full transition-colors duration-700 min-h-screen ${isLiquorMode ? 'bg-gray-950 text-white' : 'bg-white'}`}>

      {/* HERO — only on All with no search */}
      {!searchQuery && selectedCategory === "All" && (
        <section className={`w-full transition-all duration-700 relative overflow-hidden ${isLiquorMode ? 'bg-gradient-to-br from-gray-900 via-black to-purple-950 text-white' : 'bg-gradient-to-r from-blue-700 to-blue-500 text-white'}`}>
          {isLiquorMode && (
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full -mr-20 -mt-20"></div>
          )}
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10">
            <div className="max-w-3xl">
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block transition-colors ${isLiquorMode ? 'bg-purple-600 text-white' : 'bg-yellow-400 text-blue-900'}`}>
                {isLiquorMode ? "Premium Spirits Collection" : "Free Shipping on All Orders"}
              </span>
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
                {isLiquorMode ? (
                  <>Experience the <span className="text-purple-400 italic">Night</span> with Jhapp</>
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
                onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                className={`px-10 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-xl ${isLiquorMode ? 'bg-purple-600 text-white shadow-purple-500/20 hover:bg-purple-500' : 'bg-yellow-400 text-blue-900 shadow-yellow-400/30'}`}
              >
                {isLiquorMode ? "Explore Spirits" : "Shop Now"}
              </button>
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
                  ? (isLiquorMode ? "bg-purple-600 text-white border-purple-600 shadow-lg" : "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200")
                  : (isLiquorMode ? "bg-gray-900 text-gray-400 border-gray-800 hover:border-purple-500" : "bg-white text-gray-600 border-gray-200 hover:border-blue-400")
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

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
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
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
      </section>
    </div>
  );
}