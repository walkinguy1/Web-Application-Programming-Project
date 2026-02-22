import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, Zap, Wine, Heart } from 'lucide-react';

export default function Footer() {
  const { selectedCategory, setCategory } = useCartStore();
  const isLiquorMode = selectedCategory === "Liquor";

  return (
    <footer className={`transition-colors duration-700 pt-16 pb-8 ${
      isLiquorMode ? 'bg-black text-white' : 'bg-slate-900 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Brand Section */}
        <div className="col-span-1">
          <Link 
            to="/" 
            onClick={() => setCategory("All")}
            className={`text-2xl font-black tracking-tighter mb-6 flex items-center gap-2 transition-colors ${
              isLiquorMode ? 'text-purple-500 italic' : 'text-blue-400'
            }`}
          >
            {isLiquorMode ? <Wine size={24} /> : <Zap size={24} />}
            {isLiquorMode ? "JHYAPPSTORE" : "ZAPPSTORE"}
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {isLiquorMode 
              ? "Your premium destination for fine spirits and curated liquors. Elevating your moments, one glass at a time."
              : "Your premium destination for the latest in tech, fashion, and jewelry. Experience lightning-fast shopping with curated collections."}
          </p>
          <div className="flex gap-4">
            <a 
              href="https://www.instagram.com/umm__alish/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-110 ${
                isLiquorMode ? 'bg-purple-900/40 text-purple-400 hover:bg-pink-600 hover:text-white' : 'bg-slate-800 text-slate-300 hover:bg-pink-600 hover:text-white'
              }`}
            >
              <Instagram size={20} />
            </a>
            <span className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">
              <Facebook size={20} />
            </span>
            <span className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition cursor-pointer">
              <Twitter size={20} />
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-medium">
            <li><Link to="/" onClick={() => setCategory("All")} className="hover:text-white transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/cart" className="hover:text-white transition">Shopping Cart</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact Support</Link></li>
          </ul>
        </div>

        {/* Support Info */}
        <div>
          <h4 className="text-lg font-bold mb-6">Support</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li className="flex items-center gap-3">
              <MapPin size={18} className={isLiquorMode ? 'text-purple-400' : 'text-blue-400'} />
              Nepal ma ho ni
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className={isLiquorMode ? 'text-purple-400' : 'text-blue-400'} />
              9841-ZAPP
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className={isLiquorMode ? 'text-purple-400' : 'text-blue-400'} />
              support@zappstore.com
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className={`max-w-7xl mx-auto px-6 mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs ${
        isLiquorMode ? 'border-purple-900/20' : 'border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <p>© 2026 {isLiquorMode ? "JhyappStore" : "ZappStore"} Inc. All rights reserved.</p>
          <span className="hidden md:block text-slate-700">|</span>
          <p className="flex items-center gap-1 font-medium">
            Created with <Heart size={10} className={isLiquorMode ? 'text-purple-500 fill-purple-500' : 'text-blue-400 fill-blue-400'} /> by 
            <span className={`font-bold ml-1 ${isLiquorMode ? 'text-purple-400' : 'text-blue-400'}`}>The Culprits</span>
          </p>
        </div>
        
        <div className="flex gap-6">
          <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-slate-300 cursor-pointer transition-colors">Cookies</span>
        </div>
      </div>
    </footer>
  );
}