import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import { useSearch } from "../hooks/Search/UseSearch";
import { useProducts } from "../hooks/product/UseProducts";

export default function Home() {
  const { products, loading } = useProducts();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useSearch();

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    { name: "electronics", displayName: "Electronics", icon: "💻" },
    { name: "jewelery", displayName: "Jewelry", icon: "💎" },
    { name: "men's clothing", displayName: "Men's", icon: "👔" },
    { name: "women's clothing", displayName: "Women's", icon: "👗" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Hero />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className="bg-white rounded-lg p-6 text-center hover:shadow-md transition border"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-slate-800">
                {cat.displayName}
              </div>
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {searchQuery
              ? `Search: "${searchQuery}"`
              : selectedCategory === "All Categories"
              ? "All Products"
              : selectedCategory}
          </h2>
          <p className="text-gray-600">
            {loading ? "Loading..." : `${filteredProducts.length} products`}
          </p>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg animate-pulse">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
