import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus, X, Minus, ShoppingBag, RefreshCw, Home } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";

// AliExpress Saudi Arabia URL with SAR currency
const ALIEXPRESS_URL = "https://ar.aliexpress.com/?aff_fcid=&aff_fsk=&aff_platform=portals-search-bar&sk=&aff_trace_key=&af=&cv=&cn=&dp=&terminal_id=&afSmart498Site=&gatewayAda498pter=&language=ar&currency=SAR&region=SA";

const AliExpressPage = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);
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
    // Fetch cart count
    fetch(`${API_URL}/cart`, { credentials: "include" })
      .then(res => res.json())
      .then(items => setCartCount(items.length))
      .catch(console.error);
  }, []);

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
          product_url: productData.product_url || ALIEXPRESS_URL,
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

  const refreshIframe = () => {
    setIframeKey(prev => prev + 1);
    toast.success("تم تحديث الصفحة");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 via-red-500 to-red-600 px-4 py-3 flex items-center justify-between shadow-lg"
      >
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
              <p className="text-white/70 text-xs">بالريال السعودي 🇸🇦</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            data-testid="refresh-btn"
            variant="ghost"
            onClick={refreshIframe}
            className="rounded-xl text-white hover:bg-white/20 p-2"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
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
      </motion.header>

      {/* WebView Container - Full Screen */}
      <div className="flex-1 relative">
        <iframe
          key={iframeKey}
          data-testid="aliexpress-iframe"
          src={ALIEXPRESS_URL}
          className="w-full h-full border-0"
          style={{ minHeight: "calc(100vh - 140px)" }}
          title="AliExpress Saudi Arabia"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
          allow="clipboard-write"
        />
      </div>

      {/* Floating Add Button */}
      <motion.button
        data-testid="add-to-cart-floating-btn"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-2 pulse-glow z-40"
      >
        <Plus className="w-5 h-5" />
        <span className="font-bold">إضافة إلى سلة وصول</span>
      </motion.button>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-24 right-4 flex flex-col gap-2 z-40"
      >
        <Button
          data-testid="home-btn"
          onClick={() => navigate("/browse")}
          className="w-12 h-12 rounded-full bg-white shadow-lg text-gray-700 hover:bg-gray-50"
        >
          <Home className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Add to Cart Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="glass border-0 rounded-3xl max-w-md mx-4 max-h-[90vh] overflow-y-auto">
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
                <label className="text-sm font-medium text-gray-700 mb-1 block">السعر (ريال سعودي) *</label>
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

export default AliExpressPage;
