import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import { ShoppingCart, Zap, Search, User, LogOut } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function Navbar() {
  const { 
    cartCount, 
    fetchCartCount, 
    user, 
    logout, 
    searchQuery, 
    setSearchQuery,
    selectedCategory,
    setCategory 
  } = useCartStore();

  // Initialize the location hook
  const location = useLocation();

  // Categories list
  const categories = ["All", "Electronics", "Jewelry", "Men's Clothing", "Women's Clothing"];

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  // Check if the current page is the cart page
  const isCartPage = location.pathname === '/cart';

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      {/* MAIN NAV BAR */}
      <nav className="bg-white/90 backdrop-blur-md py-3 px-6 md:px-10 flex justify-between items-center border-b border-gray-100">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Zap size={22} className="text-white fill-current" />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase">ZAPPSTORE</span>
        </Link>

        {/* SEARCH BAR */}
        <div className="hidden md:flex flex-1 max-w-lg mx-10">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-gray-100 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-5">
          <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-all group">
            <ShoppingCart size={26} className="text-gray-700 group-hover:text-blue-600" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <button onClick={logout} className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-bold text-sm">
              <LogOut size={20} />
              <span className="hidden sm:block text-gray-900">{user.username}</span>
            </button>
          ) : (
            <Link to="/login" className="bg-gray-900 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* CATEGORY SUB-NAV BAR - ONLY SHOW IF NOT ON CART PAGE */}
      {!isCartPage && (
        <div className="bg-white border-b border-gray-100 overflow-x-auto no-scrollbar animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="max-w-7xl mx-auto px-6 md:px-10 flex gap-8 py-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setSearchQuery(""); // Clear search when switching categories
                }}
                className={`text-xs font-extrabold uppercase tracking-widest whitespace-nowrap transition-all pb-1 border-b-2 ${
                  selectedCategory === cat 
                  ? "text-blue-600 border-blue-600" 
                  : "text-gray-400 border-transparent hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}