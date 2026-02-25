import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import backendURL from '../config';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendURL}/api/wishlist/my_wishlist/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.products || []);
      } else {
        setError('Failed to load wishlist');
      }
    } catch (err) {
      setError('Error fetching wishlist: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`${backendURL}/api/wishlist/remove_product/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (response.ok) {
        setWishlistItems(wishlistItems.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      console.log('Adding to cart:', { product_id: product.id, quantity: 1 });
      console.log('Using token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
      console.log('Endpoint:', `${backendURL}/api/cart/add/`);
      
      const response = await fetch(`${backendURL}/api/cart/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        removeFromWishlist(product.id);
        // Navigate to cart page
        navigate('/cart');
      } else {
        alert('Error: ' + (responseData.error || responseData.message || 'Failed to add to cart'));
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Error: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-6 sm:mb-8">
          <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-red-500 fill-red-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
          <span className="ml-auto px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm font-semibold">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-4">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300" />
            </div>
            <p className="text-lg sm:text-xl text-gray-600 mb-6">Your wishlist is empty</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-sm sm:text-base"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {wishlistItems.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                {/* Product Image */}
                <div className="relative h-40 sm:h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image || 'https://placehold.co/400x300?text=No+Image'}
                    alt={product.title}
                    className="h-full w-full object-contain p-3 hover:scale-110 transition-transform"
                    onError={e => {
                      e.target.src = 'https://placehold.co/400x300?text=No+Image';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-grow">
                  <Link
                    to={`/product/${product.id}`}
                    className="text-base sm:text-lg font-bold text-gray-900 hover:text-blue-600 transition line-clamp-2 mb-2"
                  >
                    {product.title}
                  </Link>

                  <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-1">
                    {product.description}
                  </p>

                  {/* Price and Category */}
                  <div className="flex items-center justify-between mt-auto mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base font-bold"
                    >
                      <ShoppingCart size={18} />
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="flex items-center justify-center px-3 py-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
