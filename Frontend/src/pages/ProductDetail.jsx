import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore';
import { Loader2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Pull theme-related state from the store
  const { triggerToast, updateCount, selectedCategory } = useCartStore();
  
  // Check if we are in "Night Mode"
  const isLiquorMode = selectedCategory === "Liquor";
  
  const backendURL = "http://127.0.0.1:8000";
  const initialCategory = useRef(selectedCategory);

  // Redirect if category changes via Navbar while on this page
  useEffect(() => {
    if (selectedCategory !== initialCategory.current) {
      navigate('/');
    }
  }, [selectedCategory, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    axios.get(`${backendURL}/api/products/${id}/`)
      .then(res => {
        setProduct(res.data);
        setActiveImage(res.data.image);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const res = await axios.post(`${backendURL}/api/cart/add/`, {
        product_id: product.id,
        quantity: quantity
      });
      updateCount(res.data.cart_count);
      triggerToast(`${product.title} added to cart!`);
    } catch (err) {
      console.error(err);
      triggerToast("Failed to add to cart", "error");
    }
  };

  const getFullUrl = (path) => path?.startsWith('http') ? path : `${backendURL}${path}`;

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${
        isLiquorMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
      }`}>
        <Loader2 className={`w-12 h-12 animate-spin mb-4 ${isLiquorMode ? 'text-purple-500' : 'text-blue-600'}`} />
        <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Loading Product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isLiquorMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
      }`}>
        <p className="text-2xl font-black">PRODUCT NOT FOUND</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-700 ${
      isLiquorMode ? 'bg-gray-950 text-white' : 'bg-white'
    }`}>
      <div className="container mx-auto p-6 md:p-10">
        <div className={`flex flex-col md:flex-row gap-12 p-4 md:p-8 rounded-[3rem] border transition-all duration-500 ${
          isLiquorMode 
            ? 'bg-gray-900/40 border-purple-900/30 shadow-[0_0_50px_rgba(147,51,234,0.05)]' 
            : 'bg-white border-gray-100'
        }`}>
          
          {/* Image Section */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className={`aspect-square rounded-[2.5rem] p-12 flex items-center justify-center border shadow-inner overflow-hidden transition-all duration-500 ${
              isLiquorMode ? 'bg-black border-purple-900/20 shadow-purple-900/10' : 'bg-gray-50 border-gray-50 shadow-inner'
            }`}>
              <img 
                src={getFullUrl(activeImage)} 
                alt={product.title} 
                className="max-h-full w-full object-contain hover:scale-110 transition-transform duration-700" 
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 px-2 no-scrollbar">
                <button 
                  onClick={() => setActiveImage(product.image)} 
                  className={`flex-shrink-0 w-24 h-24 border-2 rounded-2xl p-2 transition-all ${
                    activeImage === product.image 
                    ? (isLiquorMode ? 'border-purple-500 scale-105 shadow-purple-500/20' : 'border-blue-600 scale-105 shadow-lg') 
                    : (isLiquorMode ? 'bg-gray-900 border-transparent' : 'bg-gray-50 border-transparent')
                  }`}
                >
                  <img src={getFullUrl(product.image)} className="w-full h-full object-contain" alt="thumbnail" />
                </button>
                {product.images?.map(img => (
                  <button 
                    key={img.id} 
                    onClick={() => setActiveImage(img.image)} 
                    className={`flex-shrink-0 w-24 h-24 border-2 rounded-2xl p-2 transition-all ${
                      activeImage === img.image 
                      ? (isLiquorMode ? 'border-purple-500 scale-105 shadow-purple-500/20' : 'border-blue-600 scale-105 shadow-lg') 
                      : (isLiquorMode ? 'bg-gray-900 border-transparent' : 'bg-gray-50 border-transparent')
                    }`}
                  >
                    <img src={getFullUrl(img.image)} className="w-full h-full object-contain" alt="thumbnail" />
                  </button>
                ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center py-4">
            <div className="mb-6">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] ${
                isLiquorMode ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-50 text-blue-600'
              }`}>
                {product.category_name || product.category || "Premium Collection"}
              </span>
            </div>

            <h1 className={`text-5xl md:text-6xl font-black mb-4 tracking-tighter leading-tight ${
              isLiquorMode ? 'text-white neon-purple' : 'text-gray-900'
            }`}>
              {product.title}
            </h1>
            
            <p className={`text-4xl font-black mb-8 tracking-tighter ${
              isLiquorMode ? 'text-purple-400' : 'text-blue-600'
            }`}>
              ${parseFloat(product.price).toFixed(2)}
            </p>

            <div className={`border-t pt-8 mb-8 ${isLiquorMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <p className={`leading-relaxed text-lg font-medium ${
                isLiquorMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {product.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className={`flex items-center rounded-2xl p-1 border transition-all ${
                isLiquorMode ? 'bg-gray-900 border-purple-900/30' : 'bg-gray-50 border-gray-100'
              }`}>
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q-1))} 
                  className={`p-4 rounded-xl transition-all font-bold ${
                    isLiquorMode ? 'hover:bg-purple-900/50 hover:text-purple-400 text-gray-500' : 'hover:bg-white hover:text-blue-600 text-gray-700'
                  }`}
                >
                  <Minus size={20} />
                </button>
                <span className={`px-8 font-black text-2xl w-16 text-center ${isLiquorMode ? 'text-white' : 'text-gray-900'}`}>
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(q => q+1)} 
                  className={`p-4 rounded-xl transition-all font-bold ${
                    isLiquorMode ? 'hover:bg-purple-900/50 hover:text-purple-400 text-gray-500' : 'hover:bg-white hover:text-blue-600 text-gray-700'
                  }`}
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart} 
                className={`flex-1 font-black text-xl rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 py-5 sm:py-0 shadow-2xl ${
                  isLiquorMode 
                  ? 'bg-purple-600 text-white shadow-purple-900/40 hover:bg-purple-500' 
                  : 'bg-blue-600 text-white shadow-blue-100 hover:bg-black'
                }`}
              >
                <ShoppingBag size={24} />
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 