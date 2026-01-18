import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Trash2, Minus, Plus, ShoppingBag, Package, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const CartPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`, { credentials: "include" });
      const data = await response.json();
      setItems(data);
    } catch (error) {
      toast.error("خطأ في تحميل السلة");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await fetch(`${API_URL}/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: newQuantity })
      });
      
      setItems(items.map(item => 
        item.item_id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      toast.error("خطأ في تحديث الكمية");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await fetch(`${API_URL}/cart/${itemId}`, {
        method: "DELETE",
        credentials: "include"
      });
      
      setItems(items.filter(item => item.item_id !== itemId));
      toast.success("تم حذف المنتج");
    } catch (error) {
      toast.error("خطأ في حذف المنتج");
    }
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white pb-36"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3 flex items-center gap-3">
        <Button
          data-testid="back-btn"
          variant="ghost"
          onClick={() => navigate("/browse")}
          className="rounded-xl hover:bg-white/50"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">سلة التسوق</h1>
        <span className="mr-auto text-gray-500 text-sm">{items.length} منتج</span>
      </header>

      {/* Content */}
      <div className="px-4 py-6">
        {items.length === 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">السلة فارغة</h2>
            <p className="text-gray-500 mb-6">ابدأ بإضافة منتجات من علي إكسبريس</p>
            <Button
              data-testid="browse-btn"
              onClick={() => navigate("/browse")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-8 h-12"
            >
              تصفح المنتجات
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.item_id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100, scale: 0.8 }}
                  className="glass rounded-2xl p-4"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.product_image || "https://via.placeholder.com/150"}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{item.product_name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.size && `المقاس: ${item.size}`}
                        {item.size && item.color && " | "}
                        {item.color && `اللون: ${item.color}`}
                      </p>
                      <p className="text-lg font-bold text-blue-600 mt-2">{item.price.toFixed(2)} SAR</p>
                    </div>

                    {/* Delete Button */}
                    <Button
                      data-testid={`delete-item-${item.item_id}`}
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.item_id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">الكمية</span>
                    <div className="flex items-center gap-3">
                      <Button
                        data-testid={`decrease-qty-${item.item_id}`}
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.item_id, item.quantity - 1)}
                        className="rounded-xl w-10 h-10"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <Button
                        data-testid={`increase-qty-${item.item_id}`}
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.item_id, item.quantity + 1)}
                        className="rounded-xl w-10 h-10"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Bottom Summary */}
      {items.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 glass p-4 safe-bottom"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">المجموع</span>
            <span className="text-2xl font-bold gradient-text">{total.toFixed(2)} SAR</span>
          </div>
          <p className="text-xs text-gray-500 mb-3 text-center">جميع الأسعار بالريال السعودي (SAR)</p>
          <Button
            data-testid="checkout-btn"
            onClick={() => navigate("/addresses")}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
          >
            <Package className="w-5 h-5 ml-2" />
            تابع للدفع
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CartPage;
