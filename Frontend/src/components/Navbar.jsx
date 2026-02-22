import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Search, LogOut, Wine, UserCircle, X, LayoutDashboard, Settings, ChevronDown } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar() {
  const {
    cartCount,
    fetchCartCount,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setCategory
  } = useCartStore();

  const { user, token, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const categories = ["All", "Electronics", "Jewelry", "Men's Clothing", "Women's Clothing", "Liquor"];
  const isLiquorMode = selectedCategory === "Liquor";
  
  // Hide category bar on specific pages OR when searching
  const isHiddenPage = location.pathname === '/cart' || location.pathname === '/checkout';
  const shouldHideCategories = isHiddenPage || searchQuery.length > 0;

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  // Global scroll reset on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Helper for Avatar Initial
  const userInitial = user?.username?.charAt(0).toUpperCase() || 'U';

  // LOGO CLICK HANDLER
  const handleLogoClick = () => {
    setCategory("All");
    setSearchQuery("");
    setMobileSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CATEGORY CLICK HANDLER
  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setSearchQuery("");
    setMobileSearchOpen(false);
    
    if (location.pathname !== '/') {
      navigate('/');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>
        {`
          @keyframes electric-strike {
            0%, 10%, 90%, 100% { transform: scale(1) translate(0, 0); color: white; filter: drop-shadow(0 0 0px transparent); }
            12% { transform: scale(1.3) translate(-2px, 1px); color: #facc15; filter: drop-shadow(0 0 15px #eab308); }
            14% { transform: scale(1.1) translate(2px, -1px); color: #000000; filter: drop-shadow(0 0 5px white); }
            16% { transform: scale(1.4) translate(-1px, -2px); color: #60a5fa; filter: drop-shadow(0 0 20px #2563eb); }
            18% { transform: scale(1) translate(0, 0); color: white; filter: drop-shadow(0 0 25px white); }
            20% { transform: scale(1.2) skewX(-10deg); color: #facc15; }
            22% { transform: scale(1); color: white; }
          }
          @keyframes box-glow {
            0%, 10%, 90%, 100% { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
            15% { box-shadow: 0 0 30px 5px rgba(250, 204, 21, 0.6); }
            17% { box-shadow: 0 0 40px 10px rgba(59, 130, 246, 0.6); }
          }
          .animate-thunder-bolt { animation: electric-strike 4s infinite; }
          .animate-box-electric { animation: box-glow 4s infinite; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isLiquorMode ? 'bg-black text-white' : 'bg-white'
      }`}>

        <nav className={`backdrop-blur-md py-4 px-6 md:px-10 flex justify-between items-center border-b transition-colors duration-500 ${
          isLiquorMode ? 'bg-black/90 border-purple-900/50' : 'bg-white/90 border-gray-100'
        }`}>

          {/* LOGO */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className={`p-1.5 rounded-lg transition-all duration-500 shadow-lg ${
              isLiquorMode ? 'bg-purple-600 animate-pulse' : 'bg-blue-600 animate-box-electric'
            }`}>
              {isLiquorMode ? <Wine size={22} className="text-white fill-current" /> : <Zap size={22} className="text-white fill-current animate-thunder-bolt" />}
            </div>
            <span className={`text-2xl font-black tracking-tighter uppercase transition-all duration-500 ${
              isLiquorMode ? 'text-purple-400 italic tracking-widest' : 'text-gray-900'
            }`}>
              {isLiquorMode ? "JHYAPPSTORE" : "ZAPPSTORE"}
            </span>
          </Link>

          {/* SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-lg mx-10">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={isLiquorMode ? "Search premium spirits..." : "Search products..."}
                className={`w-full rounded-2xl py-2.5 pl-12 pr-4 text-sm font-bold transition-all outline-none border-none ${
                  isLiquorMode ? 'bg-gray-900 text-white focus:ring-2 focus:ring-purple-500/40' : 'bg-gray-100 text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:bg-white'
                }`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (location.pathname !== '/') navigate('/');
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              className={`md:hidden p-2 rounded-full transition-all ${isLiquorMode ? 'hover:bg-purple-900/30 text-purple-400' : 'hover:bg-gray-100 text-gray-700'}`}
              onClick={() => setMobileSearchOpen(prev => !prev)}
            >
              {mobileSearchOpen ? <X size={22} /> : <Search size={22} />}
            </button>

            <Link to="/cart" className={`relative p-2.5 rounded-xl transition-all group ${
              isLiquorMode ? 'hover:bg-purple-900/30 bg-gray-900' : 'hover:bg-blue-50 bg-gray-50 text-gray-700'
            }`}>
              <ShoppingCart size={22} className={`transition-colors ${
                isLiquorMode ? 'text-purple-400 group-hover:text-purple-200' : 'group-hover:text-blue-600'
              }`} />
              {cartCount > 0 && (
                <span className={`absolute -top-1 -right-1 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full ring-2 ${
                  isLiquorMode ? 'bg-purple-600 ring-black' : 'bg-blue-600 ring-white'
                }`}>
                  {cartCount}
                </span>
              )}
            </Link>

            {token ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 pr-3 rounded-full bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-white transition-all duration-300 group">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md transition-transform group-hover:scale-105 ${
                    isLiquorMode ? 'bg-purple-600' : 'bg-blue-600'
                  }`}>
                    {userInitial}
                  </div>
                  <ChevronDown size={14} className="text-gray-400 group-hover:text-blue-600 transition-transform group-hover:rotate-180" />
                </button>

                <div className="absolute right-0 mt-2 w-56 pt-2 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-[60]">
                  <div className={`rounded-3xl shadow-2xl border overflow-hidden p-2 ${
                    isLiquorMode ? 'bg-black border-purple-900' : 'bg-white border-gray-100'
                  }`}>
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account</p>
                      <p className={`text-sm font-bold truncate ${isLiquorMode ? 'text-purple-200' : 'text-gray-900'}`}>{user?.username}</p>
                    </div>

                    <Link to="/profile" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isLiquorMode ? 'hover:bg-purple-900/30 text-purple-300' : 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                    }`}>
                      <Settings size={18} /> Profile & Settings
                    </Link>

                    {user?.is_staff && (
                      <Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all">
                        <LayoutDashboard size={18} /> Admin Dashboard
                      </Link>
                    )}

                    <div className="h-px bg-gray-50 my-1" />

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                  isLiquorMode ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-900/40' : 'bg-gray-900 text-white hover:bg-blue-600 shadow-gray-200'
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* MOBILE SEARCH */}
        {mobileSearchOpen && (
          <div className={`md:hidden px-4 py-3 border-b transition-colors ${isLiquorMode ? 'bg-black border-purple-900/30' : 'bg-white border-gray-100'}`}>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                autoFocus
                type="text"
                placeholder={isLiquorMode ? "Search premium spirits..." : "Search products..."}
                className={`w-full rounded-2xl py-3 pl-11 pr-4 text-sm font-bold outline-none border-none ${isLiquorMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (location.pathname !== '/') navigate('/');
                }}
              />
            </div>
          </div>
        )}

        {/* CATEGORY BAR - Hidden when searchQuery has text */}
        {!shouldHideCategories && (
          <div className={`transition-all duration-500 border-b overflow-x-auto no-scrollbar ${isLiquorMode ? 'bg-black border-purple-900/30' : 'bg-white border-gray-100'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-10 flex gap-8 py-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all pb-1 border-b-2 ${
                    selectedCategory === cat
                      ? (isLiquorMode ? "text-purple-400 border-purple-400" : "text-blue-600 border-blue-600")
                      : (isLiquorMode ? "text-gray-600 border-transparent hover:text-purple-300" : "text-gray-400 border-transparent hover:text-gray-900")
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}