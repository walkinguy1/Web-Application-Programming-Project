import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore';

export default function Cart() {
  const [cartData, setCartData] = useState({ items: [], grand_total: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { fetchCartCount, triggerToast } = useCartStore();
  const backendURL = "http://127.0.0.1:8000";

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/cart/view/`);
      setCartData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`${backendURL}/api/cart/item/${itemId}/delete/`);
      fetchCart();        
      fetchCartCount();   
      triggerToast("Item removed from cart");
    } catch (err) {
      alert("Error removing item");
    }
  };

  const handleCheckout = () => {
    fetchCartCount(); 
    navigate('/checkout');
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      
      {/* TOP NAVIGATION LINK */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO SHOPPING
        </button>
      </div>

      <h1 className="text-4xl font-black mb-8 tracking-tighter uppercase">Your Cart</h1>
      
      {cartData.items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
           <ShoppingBag size={80} className="mx-auto text-gray-100 mb-6" />
           <p className="text-gray-400 font-bold text-xl mb-8">Your cart is feeling a bit light!</p>
           <Link to="/" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-black transition-all">
             Start Shopping
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* CART ITEMS LIST */}
          <div className="lg:col-span-2 space-y-4">
            {cartData.items.map(item => (
              <div key={item.id} className="flex items-center gap-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-gray-50 rounded-2xl p-2 flex items-center justify-center">
                  <img 
                    src={`${backendURL}${item.product_image}`} 
                    className="w-full h-full object-contain" 
                    alt={item.product_name} 
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{item.product_name}</h3>
                  <p className="text-blue-600 font-black text-sm uppercase tracking-widest">
                    ${item.product_price} <span className="text-gray-400 font-medium">x {item.quantity}</span>
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                   <span className="font-black text-xl">${item.item_total}</span>
                   <button 
                     onClick={() => handleRemove(item.id)} 
                     className="text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                   >
                      <Trash2 size={22} />
                   </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* SUMMARY SIDEBAR */}
          <div className="h-fit sticky top-24">
            <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-xl border border-gray-800">
              <h2 className="text-xl font-bold mb-6 text-gray-400 uppercase tracking-[0.2em] text-xs">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-bold">${cartData.grand_total}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400 font-bold uppercase text-xs">Free</span>
                </div>
                <div className="border-t border-gray-800 pt-4 flex justify-between items-end">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-black text-blue-400">${cartData.grand_total}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                >
                  Checkout Now <ArrowRight size={20} />
                </button>

                <button 
                  onClick={() => navigate('/')}
                  className="w-full bg-white/5 hover:bg-white/10 text-gray-300 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/10"
                >
                  <ShoppingCart size={18} /> Continue Shopping
                </button>
              </div>
              
              <p className="text-center text-[10px] text-gray-500 mt-6 uppercase tracking-widest font-bold">
                Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}