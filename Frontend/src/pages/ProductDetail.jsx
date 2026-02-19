import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore';
import { Loader2, Plus, Minus, ShoppingBag } from 'lucide-react';

const backendURL = "http://127.0.0.1:8000";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { triggerToast, updateCount, selectedCategory } = useCartStore();
  const isLiquorMode = selectedCategory === "Liquor";
  const initialCategory = useRef(selectedCategory);

  // Redirect if category changes via Navbar while on this page
  useEffect(() => {
    if (selectedCategory !== initialCategory.current) {
      navigate('/');
    }
  }, [selectedCategory, navigate]);

  // Load product + related — all inside async function to avoid cascading setState warning
  useEffect(() => {
    const load = async () => {
      window.scrollTo(0, 0);
      setLoading(true);
      setQuantity(1);

      try {
        const res = await axios.get(`${backendURL}/api/products/${id}/`);
        setProduct(res.data);
        setActiveImage(res.data.image);

        // Fetch related products (same category, exclude current)
        try {
          const relatedRes = await axios.get(`${backendURL}/api/products/?category=${res.data.category}`);
          setRelated(relatedRes.data.filter(p => p.id !== res.data.id).slice(0, 4));
        } catch {
          setRelated([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const res = await axios.post(`${backendURL}/api/cart/add/`, {
        product_id: product.id,
        quantity
      });
      updateCount(res.data.cart_count);
      triggerToast(`${product.title} added to cart!`);
    } catch (err) {
      console.error(err);
      triggerToast("Failed to add to cart");
    }
  };

  const getFullUrl = (path) => path?.startsWith('http') ? path : `${backendURL}${path}`;

  if (loading) return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${
      isLiquorMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
    }`}>
      <Loader2 className={`w-12 h-12 animate-spin mb-4 ${isLiquorMode ? 'text-purple-500' : 'text-blue-600'}`} />
      <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Loading Product...</p>
    </div>
  );

  if (!product) return (
    <div className={`min-h-screen flex items-center justify-center ${
      isLiquorMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
    }`}>
      <p className="text-2xl font-black">PRODUCT NOT FOUND</p>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-700 ${
      isLiquorMode ? 'bg-gray-950 text-white' : 'bg-white'
    }`}>
      <div className="container mx-auto p-6 md:p-10">

        {/* MAIN PRODUCT CARD */}
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
                {product.category || "Premium Collection"}
              </span>
            </div>

            <h1 className={`text-5xl md:text-6xl font-black mb-4 tracking-tighter leading-tight ${
              isLiquorMode ? 'text-white' : 'text-gray-900'
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
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className={`p-4 rounded-xl transition-all font-bold ${
                    isLiquorMode ? 'hover:bg-purple-900/50 hover:text-purple-400 text-gray-500' : 'hover:bg-white hover:text-blue-600 text-gray-700'
                  }`}
                >
                  <Minus size={20} />
                </button>
                <span className={`px-8 font-black text-2xl w-16 text-center ${
                  isLiquorMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
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

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-6 mb-8">
              <h2 className={`text-3xl font-black tracking-tighter uppercase ${
                isLiquorMode ? 'text-purple-400' : 'text-gray-900'
              }`}>
                More in {product.category}
              </h2>
              <div className={`h-px flex-1 ${isLiquorMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="group">
                  <div className={`rounded-[2rem] p-4 border transition-all duration-300 hover:shadow-xl ${
                    isLiquorMode
                      ? 'bg-gray-900/40 border-purple-900/20 hover:border-purple-500/40'
                      : 'bg-white border-gray-100 hover:border-blue-200'
                  }`}>
                    <div className={`aspect-square rounded-2xl mb-4 flex items-center justify-center p-4 ${
                      isLiquorMode ? 'bg-black' : 'bg-gray-50'
                    }`}>
                      <img
                        src={p.image?.startsWith('http') ? p.image : `${backendURL}${p.image}`}
                        alt={p.title}
                        className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h3 className={`font-bold text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors ${
                      isLiquorMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {p.title}
                    </h3>
                    <p className={`font-black ${isLiquorMode ? 'text-purple-400' : 'text-blue-600'}`}>
                      ${parseFloat(p.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
