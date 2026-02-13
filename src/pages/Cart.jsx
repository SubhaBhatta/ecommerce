import { Link } from "react-router-dom";
import { useCart } from "../hooks/Cart/useCart";
import { useAuth } from "../hooks/useAuth";

// ── icons ──────────────────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
  </svg>
);

const CartEmptyIcon = () => (
  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const ShippingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12 1.586l-4 4v3.828l-3.707 3.707a1 1 0 00-.293.707V19a2 2 0 002 2h8a2 2 0 002-2v-5.172a1 1 0 00-.293-.707L11 9.414V5.586l-4-4zM10 20h4v-9h-4v9z" clipRule="evenodd" />
  </svg>
);

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const {
    cart, loading, error,
    totalItems, subtotal, shipping, tax, total,
    increaseQty, decreaseQty, removeFromCart, clearCart,
  } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 text-center px-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full p-8">
          <CartEmptyIcon />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign in to view your cart</h2>
          <p className="text-gray-500">Your cart items will appear here after logging in.</p>
        </div>
        <Link
          to="/login"
          className="mt-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Sign In to Continue
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 font-medium">Loading your cart…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <p className="text-red-600 font-medium">⚠️ Something went wrong</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 text-center px-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-8">
          <CartEmptyIcon />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500">Looks like you haven't added anything yet.</p>
        </div>
        <Link
          to="/"
          className="mt-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const shippingNeeded = subtotal < 25 ? 25 - subtotal : 0;
  const progressPercent = Math.min((subtotal / 25) * 100, 100);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 flex items-center gap-3">
              Shopping Cart
              <span className="text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1 rounded-full shadow-md">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </h1>
            <p className="text-gray-500 mt-2">Review your items and checkout when ready</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors border-2 border-gray-200 hover:border-red-300 px-4 py-2 rounded-xl font-medium hover:bg-red-50 flex items-center gap-2"
          >
            <TrashIcon />
            Clear Cart
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {shipping > 0 && (
          <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShippingIcon />
                <span className="font-semibold text-slate-900">Free Shipping Progress</span>
              </div>
              <span className="text-sm font-bold text-amber-700">
                ${shippingNeeded.toFixed(2)} away!
              </span>
            </div>
            <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-amber-700 mt-2 font-medium">
              Add ${shippingNeeded.toFixed(2)} more to qualify for FREE shipping 🎉
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart Items */}
          <div className="flex-1 flex flex-col gap-5">
            {cart.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-md hover:shadow-xl transition-all border border-gray-100 group relative overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 transition-all duration-300 pointer-events-none" />

                {/* Image */}
                <div className="relative w-full sm:w-32 h-32 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 border-2 border-gray-100 group-hover:border-blue-200 transition-all flex-shrink-0 group-hover:shadow-md">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 relative z-10">
                  <div className="inline-block bg-blue-50 text-blue-700 text-xs uppercase tracking-wide font-bold px-3 py-1 rounded-full mb-2">
                    {item.category}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    <Link to={`/product/${item.id}`} className="hover:underline">
                      {item.title}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="font-medium">${item.price.toFixed(2)} each</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-green-600 font-semibold">In Stock</span>
                  </div>
                </div>

                {/* Quantity & Price Controls */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 w-full sm:w-auto justify-between sm:justify-start relative z-10">
                  {/* Quantity Controls */}
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      disabled={item.qty <= 1}
                      className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-12 text-center text-base font-bold text-slate-900 select-none">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">Item Total</div>
                    <div className="text-xl font-bold text-slate-900">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                    aria-label="Remove item"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}

            {/* Continue Shopping Link - Mobile */}
            <Link
              to="/"
              className="lg:hidden flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium py-4 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8 lg:sticky lg:top-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
              </div>

              <div className="space-y-4 text-base">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ShippingIcon />
                    <span className="text-gray-600">Shipping</span>
                  </div>
                  <span className={shipping === 0 ? "text-green-600 font-bold" : "font-semibold text-slate-900"}>
                    {shipping === 0 ? "FREE ✓" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Tax (8%)</span>
                  <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t-2 border-gray-100 my-6" />

              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-semibold text-slate-900">Total</span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">${total.toFixed(2)}</div>
                  <div className="text-xs text-gray-500 mt-1">Tax included</div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl text-base transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mb-4">
                <LockIcon />
                Proceed to Checkout
              </button>

              {/* Trust Badges */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 space-y-2 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Secure checkout guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">30-day return policy</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span className="font-medium">100% satisfaction guarantee</span>
                </div>
              </div>

              <Link
                to="/"
                className="hidden lg:flex items-center justify-center gap-2 text-gray-500 hover:text-blue-600 mt-6 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}