import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Package, DollarSign, CheckCircle, Clock, TrendingUp, Settings, List, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/stats`, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        toast.error("لا تملك صلاحيات الوصول");
        navigate("/browse");
      }
    } catch (error) {
      toast.error("خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { label: "طلبات جديدة", value: stats?.new_orders || 0, icon: Clock, color: "from-amber-500 to-orange-600" },
    { label: "طلبات جارية", value: stats?.in_progress || 0, icon: Package, color: "from-blue-500 to-cyan-600" },
    { label: "طلبات مكتملة", value: stats?.completed || 0, icon: CheckCircle, color: "from-green-500 to-emerald-600" },
    { label: "إجمالي المبيعات", value: `${(stats?.total_sales || 0).toFixed(2)} SAR`, icon: DollarSign, color: "from-purple-500 to-pink-600" }
  ];

  const menuItems = [
    { label: "إدارة الطلبات", icon: List, path: "/admin/orders", desc: "عرض وتحديث حالة الطلبات" },
    { label: "الإعدادات", icon: Settings, path: "/admin/settings", desc: "العمولة والشحن والحسابات" }
  ];

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
          onClick={() => navigate("/profile")}
          className="rounded-xl hover:bg-white/50"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">لوحة التحكم</h1>
      </header>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-4"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <h2 className="font-bold text-gray-800">القائمة</h2>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                data-testid={`menu-${item.path.split("/").pop()}`}
                onClick={() => navigate(item.path)}
                className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/50 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="font-bold text-gray-800">{item.label}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 rotate-180" />
              </button>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
