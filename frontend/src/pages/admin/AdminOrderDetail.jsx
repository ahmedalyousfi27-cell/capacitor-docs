import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Clock, CheckCircle, ShoppingBag, Truck, Plane, MapPin, Image, User, Phone, Mail } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const STATUS_CONFIG = {
  pending_review: { label: "قيد المراجعة", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  paid: { label: "تم الدفع", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  purchasing: { label: "قيد الشراء", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
  shipped: { label: "تم الشحن", icon: Truck, color: "text-purple-600", bg: "bg-purple-100" },
  arrived_yemen: { label: "وصل اليمن", icon: Plane, color: "text-cyan-600", bg: "bg-cyan-100" },
  completed: { label: "مكتمل", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100" }
};

const STATUS_STEPS = ["pending_review", "paid", "purchasing", "shipped", "arrived_yemen", "completed"];

const AdminOrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/orders/${orderId}`, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      toast.error("خطأ في تحميل الطلب");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updated = await response.json();
        setOrder({ ...order, status: updated.status });
        toast.success("تم تحديث الحالة");
      }
    } catch (error) {
      toast.error("خطأ في تحديث الحالة");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order?.status);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white pb-8"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3 flex items-center gap-3">
        <Button
          data-testid="back-btn"
          variant="ghost"
          onClick={() => navigate("/admin/orders")}
          className="rounded-xl hover:bg-white/50"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">تفاصيل الطلب</h1>
      </header>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Order Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-2xl p-4"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">رقم الطلب</p>
              <p className="font-bold text-lg text-gray-800">{order?.order_id}</p>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${STATUS_CONFIG[order?.status]?.bg}`}>
              <span className={`text-sm font-medium ${STATUS_CONFIG[order?.status]?.color}`}>
                {STATUS_CONFIG[order?.status]?.label}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{order?.user_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{order?.user_email}</span>
            </div>
          </div>
        </motion.div>

        {/* Address */}
        {order?.address && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-4"
          >
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              عنوان التوصيل
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium">{order.address.name}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.governorate} - {order.address.city}</p>
              {order.address.description && <p className="text-gray-500">{order.address.description}</p>}
            </div>
          </motion.div>
        )}

        {/* Products */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-4"
        >
          <h3 className="font-bold text-gray-800 mb-3">المنتجات ({order?.items?.length})</h3>
          <div className="space-y-3">
            {order?.items?.map((item, index) => (
              <div key={index} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={item.product_image || "https://via.placeholder.com/64"}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/64"; }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{item.product_name}</p>
                  <p className="text-xs text-gray-500">
                    {item.size && `المقاس: ${item.size}`}
                    {item.size && item.color && " | "}
                    {item.color && `اللون: ${item.color}`}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="text-gray-500">الكمية: {item.quantity}</span>
                    <span className="font-bold text-blue-600 mr-2">{item.price.toFixed(2)} SAR</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">المنتجات</span>
              <span>{order?.total_price?.toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">العمولة</span>
              <span>{order?.commission?.toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">الشحن</span>
              <span>{order?.shipping_fee?.toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>الإجمالي</span>
              <span className="gradient-text">{order?.grand_total?.toFixed(2)} SAR</span>
            </div>
          </div>
        </motion.div>

        {/* Payment Info */}
        {order?.payment_method && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-4"
          >
            <h3 className="font-bold text-gray-800 mb-3">بيانات الدفع</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">وسيلة الدفع</span>
                <span className="font-medium">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">اسم المرسل</span>
                <span className="font-medium">{order.sender_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">رقم المرجع</span>
                <span className="font-medium" dir="ltr">{order.payment_reference}</span>
              </div>
            </div>

            {order.receipt_image && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                  <Image className="w-4 h-4" />
                  صورة الإيصال
                </p>
                <img
                  src={order.receipt_image}
                  alt="Receipt"
                  className="w-full rounded-xl"
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Status Update */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-4"
        >
          <h3 className="font-bold text-gray-800 mb-4">تحديث الحالة</h3>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_STEPS.map((status, index) => {
              const config = STATUS_CONFIG[status];
              const Icon = config.icon;
              const isActive = order?.status === status;
              const isPast = index < currentStep;

              return (
                <Button
                  key={status}
                  data-testid={`status-${status}`}
                  onClick={() => updateStatus(status)}
                  disabled={updating || isActive}
                  variant={isActive ? "default" : "outline"}
                  className={`rounded-xl h-12 ${isActive ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}`}
                >
                  <Icon className={`w-4 h-4 ml-2 ${isActive ? "text-white" : isPast ? "text-green-600" : ""}`} />
                  {config.label}
                </Button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminOrderDetail;
