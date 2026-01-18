import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User, MapPin, LogOut, Moon, Sun, Settings, ShoppingBag, Package, Home, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", city: "" });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
      const data = await response.json();
      setUser(data);
      setFormData({ name: data.name || "", phone: data.phone || "", city: data.city || "" });
    } catch (error) {
      toast.error("خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditing(false);
        toast.success("تم حفظ التغييرات");
      }
    } catch (error) {
      toast.error("خطأ في حفظ التغييرات");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("خطأ في تسجيل الخروج");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

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
        <h1 className="text-xl font-bold text-gray-800">حسابي</h1>
      </header>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-3xl p-6 text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
          
          {user?.role === "admin" && (
            <Button
              data-testid="admin-panel-btn"
              onClick={() => navigate("/admin")}
              className="mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl"
            >
              <Shield className="w-4 h-4 ml-2" />
              لوحة الإدارة
            </Button>
          )}
        </motion.div>

        {/* Edit Profile */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">المعلومات الشخصية</h3>
            <Button
              data-testid="edit-profile-btn"
              variant="ghost"
              onClick={() => editing ? handleSave() : setEditing(true)}
              className="text-blue-600"
            >
              {editing ? "حفظ" : "تعديل"}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">الاسم</label>
              {editing ? (
                <Input
                  data-testid="profile-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl h-12 bg-white/50"
                />
              ) : (
                <p className="font-medium text-gray-800">{user?.name || "-"}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">رقم الهاتف</label>
              {editing ? (
                <Input
                  data-testid="profile-phone-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-xl h-12 bg-white/50"
                  dir="ltr"
                />
              ) : (
                <p className="font-medium text-gray-800">{user?.phone || "-"}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">المدينة</label>
              {editing ? (
                <Input
                  data-testid="profile-city-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="rounded-xl h-12 bg-white/50"
                />
              ) : (
                <p className="font-medium text-gray-800">{user?.city || "-"}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <button
            data-testid="addresses-link"
            onClick={() => navigate("/addresses")}
            className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/50 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="font-bold text-gray-800">العناوين</h3>
              <p className="text-sm text-gray-500">إدارة عناوين التوصيل</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 rotate-180" />
          </button>

          <button
            data-testid="orders-link"
            onClick={() => navigate("/orders")}
            className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/50 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="font-bold text-gray-800">طلباتي</h3>
              <p className="text-sm text-gray-500">متابعة الطلبات السابقة</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 rotate-180" />
          </button>

          <button
            data-testid="dark-mode-toggle"
            onClick={toggleDarkMode}
            className="w-full glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/50 transition-colors"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              {darkMode ? (
                <Sun className="w-6 h-6 text-amber-600" />
              ) : (
                <Moon className="w-6 h-6 text-gray-600" />
              )}
            </div>
            <div className="flex-1 text-right">
              <h3 className="font-bold text-gray-800">الوضع الداكن</h3>
              <p className="text-sm text-gray-500">{darkMode ? "مفعّل" : "معطّل"}</p>
            </div>
            <div className={`w-12 h-7 rounded-full p-1 transition-colors ${darkMode ? "bg-blue-600" : "bg-gray-300"}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? "-translate-x-5" : ""}`} />
            </div>
          </button>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            data-testid="logout-btn"
            onClick={handleLogout}
            variant="outline"
            className="w-full h-14 rounded-xl text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 ml-2" />
            تسجيل الخروج
          </Button>
        </motion.div>
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
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Package className="w-6 h-6" />
          <span className="text-xs">الطلبات</span>
        </button>
        <button
          data-testid="nav-profile"
          onClick={() => navigate("/profile")}
          className="flex flex-col items-center gap-1 text-blue-600"
        >
          <User className="w-6 h-6" />
          <span className="text-xs font-medium">حسابي</span>
        </button>
      </nav>
    </motion.div>
  );
};

export default ProfilePage;
