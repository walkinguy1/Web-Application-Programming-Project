import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Plus, Minus, ShoppingBag, Star } from 'lucide-react';

const backendURL = "http://127.0.0.1:8000";

// ── Star display (read-only) ─────────────────────────────────────────────────
function StarDisplay({ score, size = 18, className = '' }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
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

// ── Interactive star picker ──────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            size={28}
            className={
              i <= (hovered || value)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 fill-gray-300'
            }
          />
        </button>
      ))}
    </div>
  );
}

// ── Rating section component ─────────────────────────────────────────────────
function RatingSection({ productId, isLiquorMode }) {
  const { token } = useAuthStore();

  const [ratingsData, setRatingsData] = useState({ average: 0, count: 0, ratings: [] });
  const [myRating, setMyRating] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loadingRatings, setLoadingRatings] = useState(true);

  const [selectedScore, setSelectedScore] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/ratings/${productId}/`);
      setRatingsData(res.data);
    } catch { /* silent */ }
  };

  const fetchMyRating = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${backendURL}/api/ratings/${productId}/mine/`);
      setHasPurchased(res.data.has_purchased);
      if (res.data.my_rating) {
        setMyRating(res.data.my_rating);
        setSelectedScore(res.data.my_rating.score);
        setReviewText(res.data.my_rating.review);
      }
    } catch { /* silent */ }
  };

  useEffect(() => {
    const load = async () => {
      setLoadingRatings(true);
      await Promise.all([fetchRatings(), fetchMyRating()]);
      setLoadingRatings(false);
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleSubmit = async () => {
    if (!selectedScore) {
      setFormMessage('Please select a star rating.');
      return;
    }
    setSubmitting(true);
    setFormMessage('');
    try {
      const res = await axios.post(`${backendURL}/api/ratings/${productId}/submit/`, {
        score: selectedScore,
        review: reviewText,
      });
      setMyRating({ score: selectedScore, review: reviewText });
      setIsEditing(false);
      setFormMessage(res.data.message);
      setRatingsData(prev => ({ ...prev, average: res.data.new_average }));
      await fetchRatings();
    } catch (err) {
      setFormMessage(err.response?.data?.error || 'Failed to submit rating.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${backendURL}/api/ratings/${productId}/delete/`);
      setMyRating(null);
      setSelectedScore(0);
      setReviewText('');
      setIsEditing(false);
      setFormMessage('Rating removed.');
      await fetchRatings();
    } catch {
      setFormMessage('Failed to remove rating.');
    }
  };

  const labelFor = (score) => ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][score] || '';

  const card = isLiquorMode ? 'bg-gray-900/40 border-purple-900/30' : 'bg-white border-gray-100';
  const inputClass = isLiquorMode
    ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-600 focus:border-purple-500'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400';

  return (
    <div className="mt-16 space-y-8">

      {/* Header + average */}
      <div className="flex items-center gap-6">
        <h2 className={`text-3xl font-black tracking-tighter uppercase ${isLiquorMode ? 'text-purple-400' : 'text-gray-900'}`}>
          Reviews
        </h2>
        <div className={`h-px flex-1 ${isLiquorMode ? 'bg-gray-800' : 'bg-gray-100'}`} />
        {ratingsData.count > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <StarDisplay score={ratingsData.average} size={18} />
            <span className={`font-black text-lg ${isLiquorMode ? 'text-purple-400' : 'text-gray-900'}`}>
              {ratingsData.average.toFixed(1)}
            </span>
            <span className={`text-sm font-bold ${isLiquorMode ? 'text-gray-500' : 'text-gray-400'}`}>
              ({ratingsData.count} review{ratingsData.count !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      {/* Rating form */}
      {token ? (
        hasPurchased ? (
          <div className={`rounded-[2rem] border p-6 ${card}`}>
            {myRating && !isEditing ? (
              <div>
                <p className={`text-xs font-black uppercase tracking-widest mb-3 ${isLiquorMode ? 'text-gray-400' : 'text-gray-400'}`}>
                  Your Rating
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <StarDisplay score={myRating.score} size={22} />
                  <span className={`font-black ${isLiquorMode ? 'text-purple-400' : 'text-blue-600'}`}>
                    {labelFor(myRating.score)}
                  </span>
                </div>
                {myRating.review && (
                  <p className={`text-sm font-medium mb-4 ${isLiquorMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    "{myRating.review}"
                  </p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${isLiquorMode ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-blue-600 text-white hover:bg-black'}`}
                  >
                    Edit Rating
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-5 py-2 rounded-xl text-sm font-black bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className={`text-xs font-black uppercase tracking-widest mb-4 ${isLiquorMode ? 'text-gray-400' : 'text-gray-400'}`}>
                  {myRating ? 'Edit Your Rating' : 'Rate This Product'}
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <StarPicker value={selectedScore} onChange={setSelectedScore} />
                  {selectedScore > 0 && (
                    <span className={`font-black text-sm ${isLiquorMode ? 'text-purple-400' : 'text-blue-600'}`}>
                      {labelFor(selectedScore)}
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  placeholder="Write a review (optional)..."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  className={`w-full rounded-2xl p-4 text-sm font-medium border outline-none resize-none transition-all ${inputClass}`}
                />
                {formMessage && (
                  <p className={`text-xs font-bold mt-2 ${formMessage.includes('!') ? 'text-green-500' : 'text-red-500'}`}>
                    {formMessage}
                  </p>
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`px-8 py-3 rounded-xl font-black text-sm transition-all disabled:opacity-50 ${isLiquorMode ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-blue-600 text-white hover:bg-black'}`}
                  >
                    {submitting ? 'Submitting...' : myRating ? 'Update Rating' : 'Submit Rating'}
                  </button>
                  {myRating && (
                    <button
                      onClick={() => { setIsEditing(false); setSelectedScore(myRating.score); setReviewText(myRating.review); }}
                      className={`px-5 py-3 rounded-xl text-sm font-black transition-all ${isLiquorMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={`rounded-[2rem] border p-6 text-center ${card}`}>
            <p className={`font-bold text-sm ${isLiquorMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Purchase this product to leave a review.
            </p>
          </div>
        )
      ) : (
        <div className={`rounded-[2rem] border p-6 text-center ${card}`}>
          <p className={`font-bold text-sm ${isLiquorMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <Link to="/login" className={`underline ${isLiquorMode ? 'text-purple-400' : 'text-blue-600'}`}>Log in</Link> and purchase this product to leave a review.
          </p>
        </div>
      )}

      {/* All reviews */}
      {loadingRatings ? null : ratingsData.ratings.length === 0 ? (
        <p className={`text-sm font-bold text-center py-8 ${isLiquorMode ? 'text-gray-600' : 'text-gray-300'}`}>
          No reviews yet. Be the first!
        </p>
      ) : (
        <div className="space-y-4">
          {ratingsData.ratings.map(r => (
            <div key={r.id} className={`rounded-[2rem] border p-5 ${card}`}>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${isLiquorMode ? 'bg-purple-900/50 text-purple-400' : 'bg-blue-50 text-blue-600'}`}>
                    {r.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className={`font-black text-sm ${isLiquorMode ? 'text-white' : 'text-gray-900'}`}>
                      {r.username}
                    </p>
                    <p className={`text-[10px] font-bold ${isLiquorMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      {r.created_at}
                    </p>
                  </div>
                </div>
                <StarDisplay score={r.score} size={14} />
              </div>
              {r.review && (
                <p className={`text-sm font-medium mt-2 leading-relaxed ${isLiquorMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {r.review}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { triggerToast, updateCount, selectedCategory, addToCartGuest } = useCartStore();
  const isLiquorMode = selectedCategory === "Liquor";
  const initialCategory = useRef(selectedCategory);

  useEffect(() => {
    if (selectedCategory !== initialCategory.current) navigate('/');
  }, [selectedCategory, navigate]);

  useEffect(() => {
    const load = async () => {
      window.scrollTo(0, 0);
      setLoading(true);
      setQuantity(1);
      try {
        const res = await axios.get(`${backendURL}/api/products/${id}/`);
        setProduct(res.data);
        setActiveImage(res.data.image);
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
    const token = localStorage.getItem('token');
    if (token) {
      // Logged-in: add to server cart
      try {
        const res = await axios.post(`${backendURL}/api/cart/add/`, { product_id: product.id, quantity });
        updateCount(res.data.cart_count);
        triggerToast(`${product.title} added to cart!`);
      } catch (err) {
        console.error(err);
        triggerToast("Failed to add to cart");
      }
    } else {
      // Guest: add to localStorage cart
      addToCartGuest(product, quantity);
      triggerToast(`${product.title} added to cart!`);
    }
  };

  const getFullUrl = (path) => path?.startsWith('http') ? path : `${backendURL}${path}`;

  if (loading) return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${isLiquorMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <Loader2 className={`w-12 h-12 animate-spin mb-4 ${isLiquorMode ? 'text-purple-500' : 'text-blue-600'}`} />
      <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Loading Product...</p>
    </div>
  );

  if (!product) return (
    <div className={`min-h-screen flex items-center justify-center ${isLiquorMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <p className="text-2xl font-black">PRODUCT NOT FOUND</p>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isLiquorMode ? 'bg-gray-950 text-white' : 'bg-white'}`}>
      <div className="container mx-auto p-6 md:p-10">

        {/* MAIN PRODUCT CARD */}
        <div className={`flex flex-col md:flex-row gap-12 p-4 md:p-8 rounded-[3rem] border transition-all duration-500 ${isLiquorMode ? 'bg-gray-900/40 border-purple-900/30 shadow-[0_0_50px_rgba(147,51,234,0.05)]' : 'bg-white border-gray-100'}`}>

          {/* Images */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className={`aspect-square rounded-[2.5rem] p-12 flex items-center justify-center border shadow-inner overflow-hidden transition-all duration-500 ${isLiquorMode ? 'bg-black border-purple-900/20 shadow-purple-900/10' : 'bg-gray-50 border-gray-50 shadow-inner'}`}>
              <img src={getFullUrl(activeImage)} alt={product.title} className="max-h-full w-full object-contain hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 px-2 no-scrollbar">
              <button
                onClick={() => setActiveImage(product.image)}
                className={`flex-shrink-0 w-24 h-24 border-2 rounded-2xl p-2 transition-all ${activeImage === product.image ? (isLiquorMode ? 'border-purple-500 scale-105 shadow-purple-500/20' : 'border-blue-600 scale-105 shadow-lg') : (isLiquorMode ? 'bg-gray-900 border-transparent' : 'bg-gray-50 border-transparent')}`}
              >
                <img src={getFullUrl(product.image)} className="w-full h-full object-contain" alt="thumbnail" />
              </button>
              {product.images?.map(img => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.image)}
                  className={`flex-shrink-0 w-24 h-24 border-2 rounded-2xl p-2 transition-all ${activeImage === img.image ? (isLiquorMode ? 'border-purple-500 scale-105 shadow-purple-500/20' : 'border-blue-600 scale-105 shadow-lg') : (isLiquorMode ? 'bg-gray-900 border-transparent' : 'bg-gray-50 border-transparent')}`}
                >
                  <img src={getFullUrl(img.image)} className="w-full h-full object-contain" alt="thumbnail" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="w-full md:w-1/2 flex flex-col justify-center py-4">
            <div className="mb-4">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] ${isLiquorMode ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-50 text-blue-600'}`}>
                {product.category || "Premium Collection"}
              </span>
            </div>

            <h1 className={`text-5xl md:text-6xl font-black mb-4 tracking-tighter leading-tight ${isLiquorMode ? 'text-white' : 'text-gray-900'}`}>
              {product.title}
            </h1>

            {/* Inline rating summary */}
            {product.rating_rate > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <StarDisplay score={product.rating_rate} size={16} />
                <span className={`text-sm font-black ${isLiquorMode ? 'text-purple-400' : 'text-blue-600'}`}>
                  {parseFloat(product.rating_rate).toFixed(1)}
                </span>
              </div>
            )}

            <p className={`text-4xl font-black mb-8 tracking-tighter ${isLiquorMode ? 'text-purple-400' : 'text-blue-600'}`}>
              ${parseFloat(product.price).toFixed(2)}
            </p>

            <div className={`border-t pt-8 mb-8 ${isLiquorMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <p className={`leading-relaxed text-lg font-medium ${isLiquorMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {product.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className={`flex items-center rounded-2xl p-1 border transition-all ${isLiquorMode ? 'bg-gray-900 border-purple-900/30' : 'bg-gray-50 border-gray-100'}`}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className={`p-4 rounded-xl transition-all font-bold ${isLiquorMode ? 'hover:bg-purple-900/50 hover:text-purple-400 text-gray-500' : 'hover:bg-white hover:text-blue-600 text-gray-700'}`}>
                  <Minus size={20} />
                </button>
                <span className={`px-8 font-black text-2xl w-16 text-center ${isLiquorMode ? 'text-white' : 'text-gray-900'}`}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className={`p-4 rounded-xl transition-all font-bold ${isLiquorMode ? 'hover:bg-purple-900/50 hover:text-purple-400 text-gray-500' : 'hover:bg-white hover:text-blue-600 text-gray-700'}`}>
                  <Plus size={20} />
                </button>
              </div>
              <button onClick={handleAddToCart} className={`flex-1 font-black text-xl rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 py-5 sm:py-0 shadow-2xl ${isLiquorMode ? 'bg-purple-600 text-white shadow-purple-900/40 hover:bg-purple-500' : 'bg-blue-600 text-white shadow-blue-100 hover:bg-black'}`}>
                <ShoppingBag size={24} /> ADD TO CART
              </button>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <RatingSection productId={id} isLiquorMode={isLiquorMode} />

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-6 mb-8">
              <h2 className={`text-3xl font-black tracking-tighter uppercase ${isLiquorMode ? 'text-purple-400' : 'text-gray-900'}`}>
                More in {product.category}
              </h2>
              <div className={`h-px flex-1 ${isLiquorMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="group">
                  <div className={`rounded-[2rem] p-4 border transition-all duration-300 hover:shadow-xl ${isLiquorMode ? 'bg-gray-900/40 border-purple-900/20 hover:border-purple-500/40' : 'bg-white border-gray-100 hover:border-blue-200'}`}>
                    <div className={`aspect-square rounded-2xl mb-4 flex items-center justify-center p-4 ${isLiquorMode ? 'bg-black' : 'bg-gray-50'}`}>
                      <img src={p.image?.startsWith('http') ? p.image : `${backendURL}${p.image}`} alt={p.title} className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className={`font-bold text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors ${isLiquorMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {p.title}
                    </h3>
                    {p.rating_rate > 0 && <StarDisplay score={p.rating_rate} size={12} className="mb-1" />}
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