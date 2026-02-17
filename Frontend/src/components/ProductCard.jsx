import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  // Define the backend base URL
  const backendURL = "http://127.0.0.1:8000";

  return (
    // Wrap the card in a Link that points to the product ID
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
        <div className="relative h-60 w-full mb-6 overflow-hidden rounded-2xl bg-white flex items-center justify-center">
          <img 
            /* FIXED: Concatenate the backend URL with the product image path */
            src={product.image.startsWith('http') ? product.image : `${backendURL}${product.image}`} 
            alt={product.title} 
            className="h-44 w-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        <div className="flex-grow">
          <h3 className="font-bold text-gray-900 line-clamp-2 mb-4 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          <span className="text-2xl font-black text-gray-900">${product.price}</span>
        </div>
      </div>
    </Link>
  );
}