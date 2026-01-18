import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Package, Clock, CheckCircle, Truck, Plane, MapPin, Home, ShoppingBag, User, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";
const WHATSAPP_NUMBER = "+967736536150";

const STATUS_CONFIG = {
  pending_review: { label: "قيد المراجعة", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  paid: { label: "تم الدفع", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  purchasing: { label: "قيد الشراء", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
  shipped: { label: "تم الشحن", icon: Truck, color: "text-purple-600", bg: "bg-purple-100" },
  arrived_yemen: { label: "وصل إلى اليمن", icon: Plane, color: "text-cyan-600", bg: "bg-cyan-100" },
  completed: { label: "مكتمل", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" }
};

const STATUS_STEPS = ["pending_review", "paid", "purchasing", "shipped", "arrived_yemen", "completed"];

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, { credentials: "include" });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error("خطأ في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = (orderId) => {
    const message = encodeURIComponent(`مرحباً، أريد الاستفسار عن الطلب رقم: ${orderId}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${message}`, "_blank");
  };

  const getStatusIndex = (status) => STATUS_STEPS.indexOf(status);

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
      className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white pb-24"
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
        <h1 className="text-xl font-bold text-gray-800">طلباتي</h1>
        <span className="mr-auto text-gray-500 text-sm">{orders.length} طلب</span>
      </header>

      {/* Content */}
      <div className="px-4 py-6">
        {orders.length === 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">لا توجد طلبات</h2>
            <p className="text-gray-500 mb-6">ابدأ بالتسوق من علي إكسبريس</p>
            <Button
              data-testid="browse-btn"
              onClick={() => navigate("/browse")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-8 h-12"
            >
              تصفح المنتجات
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending_review;
              const StatusIcon = statusConfig.icon;
              const currentStep = getStatusIndex(order.status);

              return (
                <motion.div
                  key={order.order_id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-4"
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">رقم الطلب</p>
                      <p className="font-bold text-gray-800">{order.order_id}</p>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                      <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                      <span className={`text-sm font-medium ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Products Preview */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {order.items?.slice(0, 3).map((item, i) => (
                      <div
                        key={i}
                        className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={item.product_image || "https://via.placeholder.com/64"}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }}
                        />
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-sm text-gray-500">+{order.items.length - 3}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Timeline */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                        />
                      </div>
                      {STATUS_STEPS.map((step, i) => {
                        const StepIcon = STATUS_CONFIG[step].icon;
                        const isActive = i <= currentStep;
                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                isActive
                                  ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                                  : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              <StepIcon className="w-3 h-3" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">الإجمالي</p>
                      <p className="font-bold text-lg gradient-text">${order.grand_total?.toFixed(2)}</p>
                    </div>
                    <Button
                      data-testid={`whatsapp-btn-${order.order_id}`}
                      onClick={() => openWhatsApp(order.order_id)}
                      variant="outline"
                      className="rounded-xl flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      تواصل واتساب
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

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
          className="flex flex-col items-center gap-1 text-blue-600"
        >
          <Package className="w-6 h-6" />
          <span className="text-xs font-medium">الطلبات</span>
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
    </motion.div>
  );
};

export default OrdersPage;
