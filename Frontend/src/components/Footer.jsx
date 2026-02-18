import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="text-2xl font-black text-blue-400 tracking-tighter mb-6 block">
            ⚡ ZAPPSTORE
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Your premium destination for the latest in tech, fashion, and jewelry. 
            Experience lightning-fast shopping with curated collections.
          </p>
          <div className="flex gap-4">
            <span className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">f</span>
            <span className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition cursor-pointer">t</span>
            <span className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition cursor-pointer">i</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-medium">
            <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
            <li><Link to="/products" className="hover:text-blue-400 transition">All Products</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition">Contact Support</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-lg font-bold mb-6">Categories</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-medium">
            <li><Link to="/" className="hover:text-blue-400 transition">Electronics</Link></li>
            <li><Link to="/" className="hover:text-blue-400 transition">Jewelry</Link></li>
            <li><Link to="/" className="hover:text-blue-400 transition">Men's Fashion</Link></li>
            <li><Link to="/" className="hover:text-blue-400 transition">Women's Fashion</Link></li>
          </ul>
        </div>

        {/* Support Info */}
        <div>
          <h4 className="text-lg font-bold mb-6">Support</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li className="flex items-center gap-3">📍 Nepal ma ho ni</li>
            <li className="flex items-center gap-3">📞 9841-ZAPP</li>
            <li className="flex items-center gap-3">✉️ support@zappstore.com</li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p>© 2026 ZappStore Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
          <span className="hover:text-slate-300 cursor-pointer">Cookies</span>
        </div>
      </div>
    </footer>
  );
}