import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Search, LogOut, Wine, UserCircle, X } from 'lucide-react';
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
  const isHiddenPage = location.pathname === '/cart' || location.pathname === '/checkout';

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  return (
    <header className={`sticky top-0 z-50 w-full shadow-sm transition-all duration-500 ${
      isLiquorMode ? 'bg-black text-white' : 'bg-white'
    }`}>

      {/* MAIN NAV BAR */}
      <nav className={`backdrop-blur-md py-3 px-6 md:px-10 flex justify-between items-center border-b transition-colors duration-500 ${
        isLiquorMode ? 'bg-black/90 border-purple-900/50' : 'bg-white/90 border-gray-100'
      }`}>

        {/* LOGO */}
        <Link
          to="/"
          onClick={() => { setCategory("All"); setMobileSearchOpen(false); }}
          className="flex items-center gap-2 shrink-0"
        >
          <div className={`p-1.5 rounded-lg transition-all duration-500 shadow-lg ${
            isLiquorMode
              ? 'bg-purple-600 shadow-purple-500/40 animate-pulse'
              : 'bg-blue-600'
          }`}>
            {isLiquorMode ? (
              <Wine size={22} className="text-white fill-current" />
            ) : (
              <Zap size={22} className="text-white fill-current" />
            )}
          </div>
          <span className={`text-2xl font-black tracking-tighter uppercase transition-all duration-500 ${
            isLiquorMode ? 'text-purple-400 italic tracking-widest' : 'text-gray-900'
          }`}>
            {isLiquorMode ? "JHYAPPSTORE" : "ZAPPSTORE"}
          </span>
        </Link>

        {/* DESKTOP SEARCH BAR */}
        <div className="hidden md:flex flex-1 max-w-lg mx-10">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={isLiquorMode ? "Search premium spirits..." : "Search products..."}
              className={`w-full rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium transition-all outline-none border-none ${
                isLiquorMode
                  ? 'bg-gray-900 text-white focus:ring-2 focus:ring-purple-500/40'
                  : 'bg-gray-100 text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:bg-white'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 md:gap-5">

          {/* Mobile search toggle button */}
          <button
            className={`md:hidden p-2 rounded-full transition-all ${
              isLiquorMode ? 'hover:bg-purple-900/30 text-purple-400' : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => setMobileSearchOpen(prev => !prev)}
          >
            {mobileSearchOpen ? <X size={22} /> : <Search size={22} />}
          </button>

          {/* Cart icon */}
          <Link to="/cart" className={`relative p-2 rounded-full transition-all group ${
            isLiquorMode ? 'hover:bg-purple-900/30' : 'hover:bg-gray-100'
          }`}>
            <ShoppingCart size={26} className={`transition-colors ${
              isLiquorMode ? 'text-purple-400 group-hover:text-purple-200' : 'text-gray-700 group-hover:text-blue-600'
            }`} />
            {cartCount > 0 && (
              <span className={`absolute top-0 right-0 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full ring-2 ${
                isLiquorMode ? 'bg-purple-600 ring-black' : 'bg-red-500 ring-white'
              }`}>
                {cartCount}
              </span>
            )}
          </Link>

          {token ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  isLiquorMode ? 'text-purple-500/60' : 'text-gray-400'
                }`}>Logged in as</span>
                <Link
                  to="/profile"
                  className={`text-sm font-bold leading-none hover:underline ${
                    isLiquorMode ? 'text-purple-200' : 'text-gray-900'
                  }`}
                >
                  {user?.username}
                </Link>
                {user?.is_staff && (
                  <Link
                    to="/admin-dashboard"
                    className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:underline mt-0.5"
                  >
                    Dashboard
                  </Link>
                )}
              </div>

              <Link
                to="/profile"
                className={`flex items-center gap-2 p-2.5 rounded-xl transition-all font-bold text-sm ${
                  isLiquorMode
                    ? 'bg-gray-900 text-purple-400 hover:bg-purple-900/30'
                    : 'bg-gray-50 text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <UserCircle size={20} />
                <span className="hidden md:block">Profile</span>
              </Link>

              <button
                onClick={logout}
                className={`flex items-center gap-2 p-2.5 rounded-xl transition-all font-bold text-sm ${
                  isLiquorMode
                    ? 'bg-gray-900 text-purple-400 hover:bg-red-900/20 hover:text-red-400'
                    : 'bg-gray-50 text-gray-700 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <LogOut size={20} />
                <span className="hidden md:block">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${
                isLiquorMode
                  ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-purple-900/40'
                  : 'bg-gray-900 text-white hover:bg-blue-600'
              }`}
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* MOBILE SEARCH BAR — slides down when toggled */}
      {mobileSearchOpen && (
        <div className={`md:hidden px-4 py-3 border-b transition-colors ${
          isLiquorMode ? 'bg-black border-purple-900/30' : 'bg-white border-gray-100'
        }`}>
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              autoFocus
              type="text"
              placeholder={isLiquorMode ? "Search premium spirits..." : "Search products..."}
              className={`w-full rounded-2xl py-3 pl-11 pr-4 text-sm font-medium outline-none border-none ${
                isLiquorMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
              }`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (location.pathname !== '/') navigate('/');
              }}
            />
          </div>
        </div>
      )}

      {/* CATEGORY SUB-NAV BAR */}
      {!isHiddenPage && (
        <div className={`transition-colors duration-500 border-b overflow-x-auto no-scrollbar ${
          isLiquorMode ? 'bg-black border-purple-900/30' : 'bg-white border-gray-100'
        }`}>
          <div className="max-w-7xl mx-auto px-6 md:px-10 flex gap-8 py-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setSearchQuery("");
                  setMobileSearchOpen(false);
                  if (location.pathname !== '/') navigate('/');
                }}
                className={`text-xs font-extrabold uppercase tracking-widest whitespace-nowrap transition-all pb-1 border-b-2 ${
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
  );
}
