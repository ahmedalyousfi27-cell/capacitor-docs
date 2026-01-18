import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Package, User, Home, ExternalLink, Sparkles, TrendingUp, Truck, Shield } from "lucide-react";
import { Button } from "../components/ui/button";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const BrowsePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null);
  const [cartCount, setCartCount] = useState(0);

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

  const features = [
    { icon: TrendingUp, title: "أفضل الأسعار", desc: "خصومات حصرية" },
    { icon: Truck, title: "شحن سريع", desc: "توصيل مضمون" },
    { icon: Shield, title: "ضمان الجودة", desc: "منتجات أصلية" },
  ];

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

      {/* AliExpress Card - Main CTA */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-4 mb-6"
      >
        <motion.button
          data-testid="aliexpress-card"
          onClick={() => navigate("/aliexpress")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full relative overflow-hidden rounded-3xl shadow-xl group"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-red-600"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          {/* Content */}
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              {/* AliExpress Logo */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-red-500 font-black text-xl">Ali</span>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold">علي إكسبريس</h2>
                  <p className="text-white/80 text-sm">AliExpress</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
                <span className="text-sm font-medium">USD</span>
                <span className="text-xs">🇸🇦</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 px-4 py-2 rounded-xl">
                <p className="text-xs text-white/80">خصم حتى</p>
                <p className="text-xl font-bold">70%</p>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-xl">
                <p className="text-xs text-white/80">شحن مجاني</p>
                <p className="text-xl font-bold">✓</p>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-xl">
                <p className="text-xs text-white/80">منتجات</p>
                <p className="text-xl font-bold">+1M</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-white/90 text-sm">اضغط لتصفح المنتجات</p>
              <div className="flex items-center gap-2 bg-white text-red-500 px-4 py-2 rounded-xl font-bold group-hover:bg-white/90 transition-colors">
                <span>تصفح الآن</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="px-4 mb-6"
      >
        <div className="grid grid-cols-3 gap-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="glass rounded-2xl p-4 text-center"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{feature.title}</h3>
                <p className="text-gray-500 text-xs mt-1">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="px-4 mb-6"
      >
        <div className="glass rounded-2xl p-4">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            كيفية الطلب
          </h3>
          <ol className="space-y-3 text-gray-600 text-sm">
            <li className="flex items-start gap-3">
              <span className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
              <div>
                <p className="font-medium text-gray-800">تصفح علي إكسبريس</p>
                <p className="text-gray-500 text-xs">اضغط على البطاقة أعلاه لتصفح المنتجات</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
              <div>
                <p className="font-medium text-gray-800">أضف للسلة</p>
                <p className="text-gray-500 text-xs">اضغط زر الإضافة وأدخل تفاصيل المنتج</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
              <div>
                <p className="font-medium text-gray-800">ادفع واستلم</p>
                <p className="text-gray-500 text-xs">أكمل الدفع وتابع طلبك حتى التسليم</p>
              </div>
            </li>
          </ol>
        </div>
      </motion.div>

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
    </div>
  );
};

export default BrowsePage;
