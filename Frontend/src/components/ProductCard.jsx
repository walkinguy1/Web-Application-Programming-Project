/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import backendURL from '../config';

function StarDisplay({ score, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(score) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const imageSrc = product.image || 'https://placehold.co/400x400?text=No+Image';
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      checkWishlist();
    }
  }, [product.id, token]);

  // Listen for wishlist updates from ProductDetail page
  useEffect(() => {
    const handler = (e) => {
      if (e?.detail?.product_id === product.id) {
        setIsInWishlist(!!e.detail.in_wishlist);
      }
    };
    window.addEventListener('wishlist_updated', handler);
    return () => window.removeEventListener('wishlist_updated', handler);
  }, [product.id]);

  const checkWishlist = async () => {
    try {
      const response = await fetch(`${backendURL}/api/wishlist/check_product/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id }),
      });
      const data = await response.json();
      setIsInWishlist(data.in_wishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login first');
        setLoading(false);
        return;
      }

      const endpoint = isInWishlist ? 'remove_product' : 'add_product';
      const response = await fetch(`${backendURL}/api/wishlist/${endpoint}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id }),
      });

      if (response.ok) {
        // Toggle the wishlist state immediately for visual feedback
        const newState = !isInWishlist;
        setIsInWishlist(newState);
        // persist a short-lived flag so detail pages can pick up the change
        try {
          const now = Date.now();
          localStorage.setItem('wishlist_updated', JSON.stringify({ product_id: product.id, ts: now, in_wishlist: newState }));
          window.dispatchEvent(new CustomEvent('wishlist_updated', { detail: { product_id: product.id, ts: now, in_wishlist: newState } }));
        } catch (err) {
          // ignore storage errors
        }
        console.log('Wishlist toggled:', newState);
      } else {
        console.error('Failed to update wishlist');
        alert('Failed to update wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      alert('Error updating wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative h-full">
      {/* Wishlist Button - Heart Icon */}
      <button
        onClick={toggleWishlist}
        disabled={loading}
        className="absolute top-2 right-2 z-20 p-1.5 sm:p-2.5 rounded-full bg-white shadow-lg transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
        type="button"
        aria-label="Add to wishlist"
      >
        <Heart
          size={16}
          className={`transition-all duration-300 ${
            isInWishlist 
              ? 'text-red-500 fill-red-500' 
              : 'text-gray-400 hover:text-red-400'
          }`}
          strokeWidth={isInWishlist ? 0 : 2}
        />
      </button>

      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
          {/* Product Image Container */}
          <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden group">
            <img
              src={imageSrc}
              alt={product.title}
              className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              onError={e => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
              loading="lazy"
            />
            
            {/* Rating Badge */}
            {product.rating_rate > 0 && (
              <div className="absolute top-3 left-3 bg-white rounded-full px-2.5 py-1.5 shadow-md flex items-center gap-1.5">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="font-bold text-sm text-gray-900">
                  {parseFloat(product.rating_rate).toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-grow flex flex-col p-3 sm:p-4">
            {/* Category Badge */}
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full w-fit mb-2">
              {product.category}
            </span>

            {/* Product Title */}
            <h3 className="font-bold text-gray-900 line-clamp-2 mb-1.5 text-sm group-hover:text-blue-600 transition-colors leading-tight">
              {product.title}
            </h3>

            {/* Product Description removed to keep card compact */}

            {/* Price - Prominent Display */}
            <div className="flex items-baseline gap-2 mt-auto">
              <span className="text-lg sm:text-2xl font-black text-gray-900">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <span className="text-xs text-gray-500 font-semibold">
                USD
              </span>
            </div>
          </div>


        </div>
      </Link>
    </div>
  );
}