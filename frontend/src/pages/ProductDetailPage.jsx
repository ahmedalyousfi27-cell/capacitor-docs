import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, ShoppingBag, Star, Minus, Plus, Heart, Share2, Truck, Shield, Check, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialProduct = location.state?.product;
  
  const [product, setProduct] = useState(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [customSize, setCustomSize] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [notes, setNotes] = useState("");
  const [adding, setAdding] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchCartCount();
    if (initialProduct?.url && !initialProduct.description) {
      fetchProductDetails();
    }
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

  const fetchProductDetails = async () => {
    if (!initialProduct?.url) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/aliexpress/product?url=${encodeURIComponent(initialProduct.url)}`
      );
      const data = await response.json();
      setProduct({ ...initialProduct, ...data });
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAdding(true);
    try {
      // Build variant summary
      let variantSummary = [];
      if (customSize || selectedVariants.size) {
        variantSummary.push(`المقاس: ${customSize || selectedVariants.size}`);
      }
      if (customColor || selectedVariants.color) {
        variantSummary.push(`اللون: ${customColor || selectedVariants.color}`);
      }
      Object.entries(selectedVariants).forEach(([key, value]) => {
        if (key !== 'size' && key !== 'color' && value) {
          variantSummary.push(`${key}: ${value}`);
        }
      });

      const cartItem = {
        product_name: product.title,
        product_url: product.url || "",
        product_image: product.images?.[0] || product.image || "",
        price: product.price,
        quantity: quantity,
        size: customSize || selectedVariants.size || "",
        color: customColor || selectedVariants.color || "",
        notes: notes + (variantSummary.length > 0 ? "\n" + variantSummary.join(" | ") : "")
      };

      const response = await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(cartItem)
      });

      if (response.ok) {
        toast.success("تمت إضافة المنتج للسلة بنجاح! 🎉");
        setCartCount(prev => prev + 1);
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإضافة");
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white">
        <div className="text-center">
          <p className="text-gray-500 mb-4">لم يتم العثور على المنتج</p>
          <Button onClick={() => navigate("/aliexpress")}>العودة للمتجر</Button>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.image || "https://via.placeholder.com/400"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white pb-32"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3 flex items-center justify-between">
        <Button
          data-testid="back-btn"
          variant="ghost"
          onClick={() => navigate(-1)}
          className="rounded-xl hover:bg-white/50"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold text-gray-800">تفاصيل المنتج</h1>
        <Button
          data-testid="cart-btn"
          variant="ghost"
          onClick={() => navigate("/cart")}
          className="relative rounded-xl hover:bg-white/50"
        >
          <ShoppingBag className="w-6 h-6 text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500">جاري تحميل تفاصيل المنتج...</p>
        </div>
      ) : (
        <>
          {/* Product Images */}
          <div className="px-4 py-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="relative aspect-square bg-white">
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=No+Image"; }}
                />
                
                {/* Discount Badge */}
                {product.original_price && product.original_price > product.price && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg font-bold">
                    -{Math.round((1 - product.price / product.original_price) * 100)}%
                  </span>
                )}
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                        selectedImage === index ? "border-blue-600" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="px-4 space-y-4">
            {/* Title & Price */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-4"
            >
              <h1 className="text-lg font-bold text-gray-800 mb-3">{product.title}</h1>
              
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{product.rating || 4.5}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">{product.reviews || 100} تقييم</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">{product.orders || "500+"} طلب</span>
              </div>

              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-red-500">
                  {product.price?.toFixed(2)} <span className="text-lg">SAR</span>
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    {product.original_price?.toFixed(2)} SAR
                  </span>
                )}
              </div>
            </motion.div>

            {/* Variants */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-4"
            >
              <h2 className="font-bold text-gray-800 mb-4">اختر المواصفات</h2>
              
              {/* Color Selection */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">اللون</label>
                <Input
                  placeholder="مثال: أسود، أبيض، أزرق..."
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="rounded-xl h-12 bg-white/50"
                />
              </div>

              {/* Size Selection */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">المقاس</label>
                <Input
                  placeholder="مثال: S, M, L, XL, 42, 44..."
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  className="rounded-xl h-12 bg-white/50"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">الكمية</label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-xl w-12 h-12"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-xl w-12 h-12"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Notes */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-4"
            >
              <h2 className="font-bold text-gray-800 mb-3">ملاحظات إضافية</h2>
              <Textarea
                placeholder="أي ملاحظات خاصة بطلبك..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-xl bg-white/50 resize-none"
                rows={3}
              />
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700">شحن مضمون</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-700">ضمان الجودة</span>
                </div>
              </div>
            </motion.div>

            {/* Price Summary */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-600">الإجمالي ({quantity} قطعة)</span>
                <span className="text-2xl font-bold gradient-text">
                  {(product.price * quantity).toFixed(2)} SAR
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                جميع الأسعار بالريال السعودي (SAR)
              </p>
            </motion.div>
          </div>
        </>
      )}

      {/* Bottom Add to Cart Button */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 glass p-4 safe-bottom"
      >
        <Button
          data-testid="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={adding || loading}
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {adding ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <ShoppingBag className="w-5 h-5 ml-2" />
              أضف إلى سلة وصول
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetailPage;
