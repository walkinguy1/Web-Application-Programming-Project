/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartStore, loadGuestCart, saveGuestCart, clearGuestCart } from '../store/useCartStore';
import backendURL from '../config';

const PLACEHOLDER = 'https://placehold.co/80x80?text=?';

function resolveImage(src) {
  if (!src) return PLACEHOLDER;
  if (src.startsWith('http')) return src;
  return `${backendURL}${src}`;
}

export default function Cart() {
  const [cartData, setCartData] = useState({ items: [], grand_total: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const { fetchCartCount, triggerToast } = useCartStore();
  const isGuest = !localStorage.getItem('token');

  const fetchCart = async () => {
    if (isGuest) {
      const items = loadGuestCart();
      const grand_total = items.reduce((acc, i) => acc + i.product_price * i.quantity, 0);
      setCartData({ items, grand_total });
      setLoading(false);
    } else {
      try {
        const res = await axios.get(`${backendURL}/api/cart/view/`);
        setCartData(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleRemove = async (itemId) => {
    if (isGuest) {
      const items = loadGuestCart().filter(i => i.id !== itemId);
      saveGuestCart(items);
      await fetchCart();
      fetchCartCount();
      triggerToast("Item removed from cart");
    } else {
      try {
        await axios.delete(`${backendURL}/api/cart/item/${itemId}/delete/`);
        await fetchCart();
        fetchCartCount();
        triggerToast("Item removed from cart");
      } catch {
        triggerToast("Error removing item");
      }
    }
  };

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    setUpdatingId(itemId);
    try {
      if (isGuest) {
        const items = loadGuestCart();
        const item = items.find(i => i.id === itemId);
        if (item) {
          item.quantity = newQty;
          item.item_total = item.product_price * newQty;
        }
        saveGuestCart(items);
        await fetchCart();
        fetchCartCount();
      } else {
        await axios.patch(`${backendURL}/api/cart/item/${itemId}/update/`, { quantity: newQty });
        await fetchCart();
        fetchCartCount();
      }
    } catch {
      triggerToast("Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCheckout = () => {
    if (isGuest) {
      triggerToast("Please log in to checkout.");
      navigate('/login');
      return;
    }
    fetchCartCount();
    navigate('/checkout');
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
      {/* Back button */}
      <div className="mb-4 sm:mb-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO SHOPPING
        </button>
      </div>

      <h1 className="text-2xl sm:text-4xl font-black mb-5 sm:mb-8 tracking-tighter uppercase">Your Cart</h1>

      {/* Guest notice */}
      {isGuest && cartData.items.length > 0 && (
        <div className="mb-4 px-4 py-3 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-sm font-bold text-blue-700">
            You're shopping as a guest. <Link to="/login" className="underline">Log in</Link> to save your cart and checkout.
          </p>
        </div>
      )}

      {cartData.items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
          <ShoppingBag size={56} className="mx-auto text-gray-100 mb-4" />
          <p className="text-gray-400 font-bold text-lg mb-6">Your cart is feeling a bit light!</p>
          <Link to="/" className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black hover:bg-black transition-all text-sm">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-10">

          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-3">
            {cartData.items.map(item => (
              <div key={item.id} className="bg-white p-3 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">

                {/* Single row: image | name+price | qty | total+delete */}
                <div className="flex items-center gap-2 sm:gap-4">

                  {/* Image */}
                  <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gray-50 rounded-xl p-1 sm:p-2 flex items-center justify-center shrink-0">
                    <img
                      src={resolveImage(item.product_image)}
                      className="w-full h-full object-contain"
                      alt={item.product_name}
                      onError={e => { e.target.src = PLACEHOLDER; }}
                    />
                  </div>

                  {/* Name + unit price */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-xs sm:text-base leading-tight line-clamp-2">{item.product_name}</h3>
                    <p className="text-blue-600 font-black text-xs sm:text-sm mt-0.5">${parseFloat(item.product_price).toFixed(2)}</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-50 rounded-lg sm:rounded-xl p-0.5 sm:p-1 border border-gray-100 shrink-0">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={updatingId === item.id || item.quantity <= 1}
                      className="p-1.5 rounded-md sm:rounded-lg hover:bg-white hover:text-blue-600 transition-all text-gray-500 disabled:opacity-30"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-5 sm:w-8 text-center font-black text-gray-900 text-xs sm:text-sm">
                      {updatingId === item.id
                        ? <span className="inline-block w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        : item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={updatingId === item.id}
                      className="p-1.5 rounded-md sm:rounded-lg hover:bg-white hover:text-blue-600 transition-all text-gray-500 disabled:opacity-30"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Total + delete */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="font-black text-sm sm:text-lg">${(item.product_price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-400 p-1 sm:p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg sm:rounded-xl transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div className="h-fit lg:sticky lg:top-24">
            <div className="bg-gray-900 text-white p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] shadow-xl border border-gray-800">
              <h2 className="text-xs font-bold mb-4 sm:mb-6 text-gray-400 uppercase tracking-[0.2em]">Order Summary</h2>
              <div className="space-y-3 mb-5 sm:mb-8">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span className="font-bold">${cartData.grand_total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Shipping</span>
                  <span className="text-green-400 font-bold uppercase text-xs">Free</span>
                </div>
                <div className="border-t border-gray-800 pt-3 flex justify-between items-end">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-2xl sm:text-3xl font-black text-blue-400">${cartData.grand_total.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {isGuest ? 'Log in to Checkout' : 'Checkout Now'} <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-white/5 hover:bg-white/10 text-gray-300 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/10"
                >
                  <ShoppingCart size={15} /> Continue Shopping
                </button>
              </div>
              <p className="text-center text-[9px] text-gray-500 mt-4 uppercase tracking-widest font-bold">Secure SSL Encrypted Checkout</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}