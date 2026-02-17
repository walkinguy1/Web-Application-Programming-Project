import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore';

export default function Cart() {
  const [cartData, setCartData] = useState({ items: [], grand_total: 0 });
  const [loading, setLoading] = useState(true);
  const { fetchCartCount } = useCartStore();
  const backendURL = "http://127.0.0.1:8000";

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/cart/view/`);
      setCartData(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`${backendURL}/api/cart/item/${itemId}/delete/`);
      fetchCart();       // Refresh this page's list
      fetchCartCount();  // REFRESH THE NAVBAR COUNT
    } catch (err) {
      alert("Error removing item");
    }
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black mb-8">Your Cart</h1>
      {cartData.items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
           <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
           <p className="text-gray-500 mb-6">Your cart is empty!</p>
           <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Go Shop</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {cartData.items.map(item => (
              <div key={item.id} className="flex items-center gap-6 bg-white p-5 rounded-2xl border border-gray-100">
                <img src={`${backendURL}${item.product_image}`} className="w-20 h-20 object-contain" alt={item.product_name} />
                <div className="flex-1">
                  <h3 className="font-bold">{item.product_name}</h3>
                  <p className="text-blue-600 font-bold">${item.product_price} x {item.quantity}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="font-black">${item.item_total}</span>
                   <button onClick={() => handleRemove(item.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
                      <Trash2 size={20} />
                   </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-gray-100 h-fit">
            <h2 className="text-2xl font-bold mb-6">Summary</h2>
            <div className="flex justify-between mb-8 border-t pt-6">
              <span className="text-xl font-bold">Total</span>
              <span className="text-2xl font-black text-blue-600">${cartData.grand_total}</span>
            </div>
            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}