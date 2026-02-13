import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const rating = product.rating?.rate || 4.5;
  const ratingCount = product.rating?.count || 0;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={i <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100"
    >
      {/* Image */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <img
          src={product.image}
          alt={product.title}
          className="h-48 mx-auto object-contain group-hover:scale-105 transition-transform"
        />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-800 line-clamp-2 mb-2">
        {product.title}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-3">
        <div className="flex text-sm">{renderStars()}</div>
        <span className="text-xs text-gray-500">({ratingCount})</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">
          ${product.price}
        </span>
        {product.rating?.rate >= 4 && (
          <span className="text-xs text-green-600 font-medium">
            Free delivery
          </span>
        )}
      </div>
    </Link>
  );
}