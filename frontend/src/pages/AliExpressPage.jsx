import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, ShoppingBag, Star, Filter, RefreshCw, Home, Package, User, Plus, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const AliExpressPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`, { credentials: "include" });
      const items = await response.json();
      setCartCount(items.length);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/aliexpress/categories`);
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async (query = "", category = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (category && category !== "all") params.append("category", category);
      
      const response = await fetch(`${API_URL}/aliexpress/search?${params}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      toast.error("خطأ في تحميل المنتجات");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(searchQuery, selectedCategory);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchProducts(searchQuery, categoryId);
  };

  const handleProductClick = (product) => {
    navigate("/product", { state: { product } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white pb-24">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 px-4 py-3 shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Button
              data-testid="back-btn"
              variant="ghost"
              onClick={() => navigate("/browse")}
              className="rounded-xl text-white hover:bg-white/20 p-2"
            >
              <ArrowRight className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-red-500 font-black text-sm">Ali</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">علي إكسبريس</h1>
                <p className="text-white/70 text-xs">بالريال السعودي 🇸🇦 SAR</p>
              </div>
            </div>
          </div>

          <Button
            data-testid="cart-btn"
            variant="ghost"
            onClick={() => navigate("/cart")}
            className="relative rounded-xl text-white hover:bg-white/20 p-2"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-400 text-red-600 text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              data-testid="search-input"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 rounded-xl h-11 bg-white border-0"
            />
          </div>
          <Button
            type="submit"
            className="rounded-xl bg-white text-red-500 hover:bg-white/90 px-4"
          >
            بحث
          </Button>
        </form>
      </motion.header>

      {/* Categories */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-white/70 text-gray-700 hover:bg-white"
              }`}
            >
              <span className="ml-1">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500">جاري تحميل المنتجات...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">لا توجد منتجات</h2>
            <p className="text-gray-500">جرب البحث بكلمات مختلفة</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
            className="grid grid-cols-2 gap-3"
          >
            {products.map((product, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                onClick={() => handleProductClick(product)}
                className="glass rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.image || "https://via.placeholder.com/200"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/200?text=No+Image"; }}
                  />
                  {/* Discount Badge */}
                  {product.original_price && product.original_price > product.price && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg">
                      -{Math.round((1 - product.price / product.original_price) * 100)}%
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 h-10">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                    <span className="text-xs text-gray-400">| {product.orders} طلب</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-lg font-bold text-red-500">
                        {product.price?.toFixed(2)} <span className="text-xs">SAR</span>
                      </p>
                      {product.original_price && product.original_price > product.price && (
                        <p className="text-xs text-gray-400 line-through">
                          {product.original_price?.toFixed(2)} SAR
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                      className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Refresh Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => fetchProducts(searchQuery, selectedCategory)}
        className="fixed bottom-28 left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50"
      >
        <RefreshCw className="w-5 h-5" />
      </motion.button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass h-20 flex items-center justify-around z-40 safe-bottom">
        <button
          data-testid="nav-home"
          onClick={() => navigate("/browse")}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">الرئيسية</span>
        </button>
        <button
          data-testid="nav-cart"
          onClick={() => navigate("/cart")}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-xs">السلة</span>
        </button>
        <button
          data-testid="nav-orders"
          onClick={() => navigate("/orders")}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Package className="w-6 h-6" />
          <span className="text-xs">الطلبات</span>
        </button>
        <button
          data-testid="nav-profile"
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <User className="w-6 h-6" />
          <span className="text-xs">حسابي</span>
        </button>
      </nav>
    </div>
  );
};

export default AliExpressPage;
