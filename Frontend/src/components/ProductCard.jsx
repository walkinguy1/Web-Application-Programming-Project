import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

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
  const backendURL = "http://127.0.0.1:8000";

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
        <div className="relative h-60 w-full mb-6 overflow-hidden rounded-2xl bg-white flex items-center justify-center">
          <img
            src={product.image.startsWith('http') ? product.image : `${backendURL}${product.image}`}
            alt={product.title}
            className="h-44 w-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="flex-grow">
          <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          {/* Star rating — only show if the product has been rated */}
          {product.rating_rate > 0 ? (
            <div className="flex items-center gap-2 mb-3">
              <StarDisplay score={product.rating_rate} size={13} />
              <span className="text-xs font-black text-gray-400">
                {parseFloat(product.rating_rate).toFixed(1)}
              </span>
            </div>
          ) : (
            <div className="mb-3">
              <span className="text-xs font-bold text-gray-300">No reviews yet</span>
            </div>
          )}

          <span className="text-2xl font-black text-gray-900">${product.price}</span>
        </div>
      </div>
    </Link>
  );
}