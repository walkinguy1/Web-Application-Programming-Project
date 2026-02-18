import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore'; // Added to track login state
import { ArrowLeft, CheckCircle, CreditCard, Download, Hash, Loader2, ShoppingBag } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  
  // Pull stores
  const { cartItems, getTotalPrice, fetchCartCount, clearCart, triggerToast } = useCartStore();
  const { token } = useAuthStore();
  
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(true);

  // Memoize total to ensure it re-calculates correctly when cartItems update
  const totalAmount = useMemo(() => {
    return getTotalPrice();
  }, [cartItems, getTotalPrice]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Ensure we have the latest items from the server if logged in
      await fetchCartCount();
      setLoading(false);
    };
    loadData();
  }, [fetchCartCount, token]); // Re-run if token changes (login/logout)

  const handleDone = () => {
    if (!transactionId.trim()) {
      triggerToast("Please enter the Transaction ID first!");
      return;
    }
    
    if (totalAmount <= 0) {
      triggerToast("Cannot process an empty order.");
      return;
    }

    console.log("Submitting Order:", {
      items: cartItems,
      total: totalAmount,
      transaction_id: transactionId
    });
    
    // Here you would typically send an axios.post to your /api/orders/ endpoint
    clearCart();
    triggerToast("Payment submitted for verification!");
    navigate('/');
  };

  // If loading for the first time
  if (loading && cartItems.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Loading Secure Payment...</p>
      </div>
    );
  }

  // If not loading and still empty, redirect or show empty state
  if (!loading && cartItems.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
        <ShoppingBag size={48} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-black uppercase text-gray-400">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold uppercase text-xs tracking-widest"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 md:p-8 overflow-y-auto">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden mb-10">
        
        {/* HEADER */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div>
            <button 
              onClick={() => navigate('/cart')}
              className="flex items-center gap-1 text-blue-100 hover:text-white transition-all text-[11px] font-bold mb-2 uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back to Cart
            </button>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Payment</h1>
          </div>
          <CreditCard size={32} className="opacity-50" />
        </div>

        {/* MAIN BODY */}
        <div className="p-6 space-y-6">
          
          <div className="text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Total Amount</p>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter">
              ${totalAmount.toFixed(2)}
            </h2>
          </div>

          {/* QR SECTION */}
          <div className="flex flex-col items-center py-2">
            <div className="p-3 bg-white border-2 border-gray-50 rounded-2xl shadow-sm">
              <img 
                src="/qr.png" 
                alt="Payment QR" 
                className="w-32 h-32 md:w-40 md:h-40 object-contain"
              />
            </div>
            <a 
              href="/qr.png" 
              download 
              className="mt-3 flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline uppercase tracking-widest"
            >
              <Download size={14} /> Save QR Code
            </a>
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
              <ShoppingBag size={14} className="text-gray-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Items Summary</h3>
            </div>
            
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar text-sm">
              {cartItems.map((item) => {
                // Defensive price check
                const itemPrice = parseFloat(item.product?.price || item.product_price || item.price || 0);
                const itemTitle = item.product?.title || item.product_name || "Unknown Product";
                
                return (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="max-w-[70%]">
                      <p className="font-bold text-gray-800 leading-tight line-clamp-1">
                        {itemTitle}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-black text-gray-900 shrink-0">
                      ${(itemPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRANSACTION INPUT SECTION */}
          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 mb-2">
                Transaction ID / Ref Number
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text"
                  placeholder="Enter Bank Ref ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-4 pl-11 pr-4 font-bold text-sm text-gray-900 focus:border-blue-600 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            {totalAmount > 0 && (
              <div className="flex items-center justify-center gap-2 text-green-600 font-bold bg-green-50 py-3 rounded-xl border border-green-100 text-xs uppercase tracking-tight">
                <CheckCircle size={16} />
                <span>Confirming ${totalAmount.toFixed(2)}</span>
              </div>
            )}

            <button 
              onClick={handleDone}
              disabled={!transactionId.trim() || totalAmount === 0}
              className={`w-full py-5 rounded-2xl font-black text-base tracking-widest transition-all shadow-xl active:scale-95 uppercase ${
                transactionId.trim() && totalAmount > 0
                ? 'bg-gray-900 text-white hover:bg-black' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              COMPLETE ORDER
            </button>
          </div>
          
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] text-center italic opacity-60 pb-2">
            Verification typically takes 5-10 minutes
          </p>
        </div>
      </div>
    </div>
  );
}