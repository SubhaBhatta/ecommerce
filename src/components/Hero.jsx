export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-50 via-teal-50 to-cyan-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Welcome to SUBHAcommerce
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Discover quality products at great prices
          </p>
          <div className="flex justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-gray-600 mt-1">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">Fast</div>
              <div className="text-sm text-gray-600 mt-1">Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600 mt-1">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}