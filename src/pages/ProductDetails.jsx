import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";

// Star component with half-star support
const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <span key={i} className="text-yellow-400">
          ★
        </span>
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <span key={i} className="relative">
          <span className="text-gray-300">★</span>
          <span className="absolute top-0 left-0 overflow-hidden w-1/2 text-yellow-400">
            ★
          </span>
        </span>
      );
    } else {
      stars.push(
        <span key={i} className="text-gray-300">
          ★
        </span>
      );
    }
  }
  return <div className="flex gap-0.5 text-xl">{stars}</div>;
};

// Badge component
const Badge = ({ children, variant = "primary" }) => {
  const variants = {
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800"
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `https://fakestoreapi.com/products/${id}`
        );
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product details", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  let i = Math.random()

  const discountPercent = Math.floor(i * 20) + 10; // Mock discount
  const originalPrice = (product.price * (1 + discountPercent / 100)).toFixed(2);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 sticky top-8 h-fit">
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 mb-4 group overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <img
                src={product.image}
                alt={product.title}
                className="max-h-96 w-full object-contain relative z-10 transform transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Sale badge */}
              <div className="absolute top-4 right-4 z-20">
                <Badge variant="warning">{discountPercent}% OFF</Badge>
              </div>
            </div>

            {/* Thumbnail gallery (mock - same image repeated) */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 transition-all ${
                    selectedImage === idx
                      ? "border-blue-600 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={`View ${idx + 1}`}
                    className="w-full h-full object-contain p-2 bg-gray-50 rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-6">
            {/* Category badge */}
            <div>
              <Badge>{product.category}</Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <StarRating rating={product.rating?.rate || 4.5} />
              <span className="text-sm font-medium text-gray-700">
                {product.rating?.rate || 4.5}
              </span>
              <span className="text-sm text-gray-500">
                · {product.rating?.count || 0} reviews
              </span>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl lg:text-5xl font-bold text-slate-900">
                  ${product.price}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${originalPrice}
                </span>
                <span className="text-green-600 font-semibold text-sm">
                  Save ${(originalPrice - product.price).toFixed(2)}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-700 font-medium">In Stock</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  <span className="text-blue-700 font-medium">FREE Shipping over $25</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Product Details
              </h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Key Features */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <h3 className="font-bold text-lg text-slate-900 mb-4">Key Features</h3>
              <ul className="space-y-2">
                {['Premium Quality Materials', 'Fast & Free Shipping', '30-Day Returns', 'Secure Payment'].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky bottom-0 lg:static">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <label className="font-semibold text-slate-800">Quantity:</label>
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors font-semibold text-gray-700"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(10, Number(e.target.value))))}
                    className="w-16 text-center py-2 font-semibold focus:outline-none"
                    min="1"
                    max="10"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors font-semibold text-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 ${
                    added
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
                >
                  {added ? (
                    <>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
                
                <Link
                  to="/cart"
                  className="flex-1 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-8 py-4 rounded-xl font-bold text-lg text-center transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  
                  Buy Now
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure Checkout
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Quality
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
