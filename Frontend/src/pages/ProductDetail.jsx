import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/useCartStore';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { triggerToast, updateCount } = useCartStore();
  const backendURL = "http://127.0.0.1:8000";

  useEffect(() => {
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

      // Update count and show the nice toast
      updateCount(res.data.cart_count);
      triggerToast(`${product.title} added to cart!`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Loading...</div>;

  const getFullUrl = (path) => path?.startsWith('http') ? path : `${backendURL}${path}`;

  return (
    <div className="container mx-auto p-6 md:p-10 min-h-screen">
      <div className="flex flex-col md:flex-row gap-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        
        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <div className="aspect-square bg-gray-50 rounded-2xl p-8 flex items-center justify-center border border-gray-50 mb-4">
            <img src={getFullUrl(activeImage)} alt={product.title} className="max-h-full object-contain" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
             <button onClick={() => setActiveImage(product.image)} className={`w-20 h-20 border-2 rounded-lg p-1 ${activeImage === product.image ? 'border-blue-600' : 'border-transparent'}`}>
                <img src={getFullUrl(product.image)} className="w-full h-full object-contain" />
             </button>
             {product.images?.map(img => (
               <button key={img.id} onClick={() => setActiveImage(img.image)} className={`w-20 h-20 border-2 rounded-lg p-1 ${activeImage === img.image ? 'border-blue-600' : 'border-transparent'}`}>
                  <img src={getFullUrl(img.image)} className="w-full h-full object-contain" />
               </button>
             ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">{product.title}</h1>
          <p className="text-3xl font-bold text-gray-900 mb-8">${product.price}</p>
          <div className="border-t border-b py-8 mb-8">
            <p className="text-gray-500 leading-relaxed text-lg">{product.description}</p>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-2xl overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-6 py-4 bg-gray-50 hover:bg-gray-100 font-bold">-</button>
              <span className="px-8 py-4 font-black text-xl">{quantity}</span>
              <button onClick={() => setQuantity(q => q+1)} className="px-6 py-4 bg-gray-50 hover:bg-gray-100 font-bold">+</button>
            </div>
            <button onClick={handleAddToCart} className="flex-1 bg-blue-600 text-white font-black text-xl rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}