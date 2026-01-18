import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, Clock, CheckCircle, ShoppingBag, Truck, Plane, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
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

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/orders`, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      toast.error("خطأ في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_id.toLowerCase().includes(search.toLowerCase()) ||
                         order.user_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white pb-8"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3 flex items-center gap-3">
        <Button
          data-testid="back-btn"
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="rounded-xl hover:bg-white/50"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">إدارة الطلبات</h1>
        <span className="mr-auto text-gray-500 text-sm">{orders.length} طلب</span>
      </header>

      {/* Filters */}
      <div className="px-4 py-4 space-y-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            data-testid="search-input"
            placeholder="بحث برقم الطلب أو اسم العميل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 rounded-xl h-12 bg-white/70"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            data-testid="filter-all"
            variant={statusFilter === "all" ? "default" : "outline"}
            onClick={() => setStatusFilter("all")}
            className="rounded-xl flex-shrink-0"
          >
            الكل
          </Button>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <Button
              key={key}
              data-testid={`filter-${key}`}
              variant={statusFilter === key ? "default" : "outline"}
              onClick={() => setStatusFilter(key)}
              className="rounded-xl flex-shrink-0"
            >
              {config.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">لا توجد طلبات</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending_review;
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={order.order_id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-2xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800">{order.order_id}</p>
                    <p className="text-sm text-gray-500">{order.user_name}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                    <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                    <span className={`text-xs font-medium ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{order.items?.length} منتج</p>
                    <p className="font-bold gradient-text">${order.grand_total?.toFixed(2)}</p>
                  </div>
                  <Button
                    data-testid={`view-order-${order.order_id}`}
                    onClick={() => navigate(`/admin/orders/${order.order_id}`)}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  >
                    <Eye className="w-4 h-4 ml-2" />
                    عرض
                  </Button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default AdminOrders;
