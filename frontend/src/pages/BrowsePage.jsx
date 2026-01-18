import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Plus, X, Minus, Home, Package, User, ExternalLink } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const BrowsePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null);
  const [cartCount, setCartCount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [productData, setProductData] = useState({
    product_name: "",
    product_url: "",
    product_image: "",
    price: "",
    quantity: 1,
    size: "",
    color: "",
    notes: ""
  });

  useEffect(() => {
    // Fetch user if not in state
    if (!user) {
      fetch(`${API_URL}/auth/me`, { credentials: "include" })
        .then(res => res.json())
        .then(setUser)
        .catch(console.error);
    }
    // Fetch cart count
    fetch(`${API_URL}/cart`, { credentials: "include" })
      .then(res => res.json())
      .then(items => setCartCount(items.length))
      .catch(console.error);
  }, [user]);

  const handleAddToCart = async () => {
    if (!productData.product_name || !productData.price) {
      toast.error("يرجى إدخال اسم المنتج والسعر");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...productData,
          price: parseFloat(productData.price),
          product_url: productData.product_url || "https://ar.aliexpress.com",
          product_image: productData.product_image || "https://via.placeholder.com/150"
        })
      });

      if (response.ok) {
        toast.success("تمت إضافة المنتج للسلة");
        setCartCount(prev => prev + 1);
        setShowAddModal(false);
        setProductData({
          product_name: "",
          product_url: "",
          product_image: "",
          price: "",
          quantity: 1,
          size: "",
          color: "",
          notes: ""
        });
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإضافة");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white pb-24">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 glass px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg gradient-text">وصول</span>
        </div>

        <Button
          data-testid="cart-btn"
          onClick={() => navigate("/cart")}
          variant="ghost"
          className="relative rounded-xl hover:bg-white/50"
        >
          <ShoppingBag className="w-6 h-6 text-gray-700" />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {cartCount}
            </motion.span>
          )}
        </Button>
      </motion.header>

      {/* Welcome message */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-4 py-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          مرحباً {user?.name?.split(" ")[0] || "بك"}! 👋
        </h1>
        <p className="text-gray-600">تصفح منتجات علي إكسبريس وأضفها لسلتك</p>
      </motion.div>

      {/* AliExpress iframe container */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-4 mb-6"
      >
        <div className="glass rounded-3xl overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between">
            <span className="text-white font-medium">علي إكسبريس العربي</span>
            <a
              href="https://ar.aliexpress.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white flex items-center gap-1 text-sm"
            >
              <span>فتح في نافذة جديدة</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="relative" style={{ height: "60vh" }}>
            <iframe
              data-testid="aliexpress-iframe"
              src="https://ar.aliexpress.com"
              className="w-full h-full border-0"
              title="AliExpress"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="px-4 mb-6"
      >
        <div className="glass rounded-2xl p-4">
          <h3 className="font-bold text-gray-800 mb-3">كيفية الطلب:</h3>
          <ol className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
              <span>تصفح المنتجات في علي إكسبريس أعلاه</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
              <span>انسخ رابط المنتج واضغط على زر "إضافة للسلة"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
              <span>أكمل عملية الدفع واستلم طلبك</span>
            </li>
          </ol>
        </div>
      </motion.div>

      {/* Floating Add Button */}
      <motion.button
        data-testid="add-to-cart-floating-btn"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-2 pulse-glow z-30"
      >
        <Plus className="w-5 h-5" />
        <span className="font-bold">إضافة إلى سلة وصول</span>
      </motion.button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass h-20 flex items-center justify-around z-40 safe-bottom">
        <button
          data-testid="nav-home"
          onClick={() => navigate("/browse")}
          className="flex flex-col items-center gap-1 text-blue-600"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">الرئيسية</span>
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

      {/* Add to Cart Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="glass border-0 rounded-3xl max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">إضافة منتج للسلة</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">اسم المنتج *</label>
              <Input
                data-testid="product-name-input"
                placeholder="مثال: هاتف سامسونج"
                value={productData.product_name}
                onChange={(e) => setProductData({ ...productData, product_name: e.target.value })}
                className="rounded-xl h-12 bg-white/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">رابط المنتج</label>
              <Input
                data-testid="product-url-input"
                placeholder="https://ar.aliexpress.com/item/..."
                value={productData.product_url}
                onChange={(e) => setProductData({ ...productData, product_url: e.target.value })}
                className="rounded-xl h-12 bg-white/50"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">رابط صورة المنتج</label>
              <Input
                data-testid="product-image-input"
                placeholder="https://..."
                value={productData.product_image}
                onChange={(e) => setProductData({ ...productData, product_image: e.target.value })}
                className="rounded-xl h-12 bg-white/50"
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">السعر (دولار) *</label>
                <Input
                  data-testid="product-price-input"
                  type="number"
                  placeholder="0.00"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  className="rounded-xl h-12 bg-white/50"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">الكمية</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setProductData({ ...productData, quantity: Math.max(1, productData.quantity - 1) })}
                    className="rounded-xl"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-bold">{productData.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setProductData({ ...productData, quantity: productData.quantity + 1 })}
                    className="rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">المقاس</label>
                <Input
                  data-testid="product-size-input"
                  placeholder="XL, 42, ..."
                  value={productData.size}
                  onChange={(e) => setProductData({ ...productData, size: e.target.value })}
                  className="rounded-xl h-12 bg-white/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">اللون</label>
                <Input
                  data-testid="product-color-input"
                  placeholder="أسود، أبيض، ..."
                  value={productData.color}
                  onChange={(e) => setProductData({ ...productData, color: e.target.value })}
                  className="rounded-xl h-12 bg-white/50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">ملاحظات</label>
              <Textarea
                data-testid="product-notes-input"
                placeholder="أي ملاحظات إضافية..."
                value={productData.notes}
                onChange={(e) => setProductData({ ...productData, notes: e.target.value })}
                className="rounded-xl bg-white/50 resize-none"
                rows={3}
              />
            </div>

            <Button
              data-testid="confirm-add-to-cart-btn"
              onClick={handleAddToCart}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
            >
              <ShoppingBag className="w-5 h-5 ml-2" />
              أضف إلى سلة وصول
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrowsePage;
