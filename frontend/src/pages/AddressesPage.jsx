import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus, MapPin, Trash2, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const GOVERNORATES = [
  "صنعاء",
  "عدن",
  "تعز",
  "الحديدة",
  "إب",
  "ذمار",
  "حضرموت",
  "المكلا",
  "مأرب",
  "البيضاء",
  "صعدة",
  "عمران",
  "الجوف",
  "شبوة",
  "أبين",
  "لحج",
  "المهرة",
  "سقطرى",
  "الضالع",
  "ريمة"
];

const AddressesPage = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    governorate: "",
    city: "",
    description: "",
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${API_URL}/addresses`, { credentials: "include" });
      const data = await response.json();
      setAddresses(data);
      // Auto-select default address
      const defaultAddr = data.find(a => a.is_default);
      if (defaultAddr) setSelectedAddress(defaultAddr.address_id);
      else if (data.length > 0) setSelectedAddress(data[0].address_id);
    } catch (error) {
      toast.error("خطأ في تحميل العناوين");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!formData.name || !formData.phone || !formData.governorate || !formData.city) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success("تم إضافة العنوان");
        setShowAddModal(false);
        setFormData({ name: "", phone: "", governorate: "", city: "", description: "", is_default: false });
        fetchAddresses();
      }
    } catch (error) {
      toast.error("خطأ في إضافة العنوان");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await fetch(`${API_URL}/addresses/${addressId}`, {
        method: "DELETE",
        credentials: "include"
      });
      toast.success("تم حذف العنوان");
      fetchAddresses();
    } catch (error) {
      toast.error("خطأ في حذف العنوان");
    }
  };

  const handleContinue = async () => {
    if (!selectedAddress) {
      toast.error("يرجى اختيار عنوان التوصيل");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ address_id: selectedAddress })
      });

      if (response.ok) {
        const order = await response.json();
        navigate(`/payment/${order.order_id}`);
      } else {
        const error = await response.json();
        toast.error(error.detail || "خطأ في إنشاء الطلب");
      }
    } catch (error) {
      toast.error("خطأ في إنشاء الطلب");
    }
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
      className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white pb-36"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-3 flex items-center gap-3">
        <Button
          data-testid="back-btn"
          variant="ghost"
          onClick={() => navigate("/cart")}
          className="rounded-xl hover:bg-white/50"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">عنوان التوصيل</h1>
      </header>

      {/* Content */}
      <div className="px-4 py-6 space-y-4">
        {/* Add Address Button */}
        <motion.button
          data-testid="add-address-btn"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => setShowAddModal(true)}
          className="w-full glass rounded-2xl p-4 flex items-center gap-3 border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <span className="font-medium text-blue-600">إضافة عنوان جديد</span>
        </motion.button>

        {/* Addresses List */}
        {addresses.map((address, index) => (
          <motion.div
            key={address.address_id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedAddress(address.address_id)}
            className={`glass rounded-2xl p-4 cursor-pointer transition-all ${
              selectedAddress === address.address_id
                ? "ring-2 ring-blue-600 bg-blue-50/50"
                : "hover:bg-white/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedAddress === address.address_id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}>
                {selectedAddress === address.address_id ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <MapPin className="w-6 h-6" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-800">{address.name}</h3>
                  {address.is_default && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                      افتراضي
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {address.governorate} - {address.city}
                </p>
                {address.description && (
                  <p className="text-sm text-gray-400 mt-1">{address.description}</p>
                )}
              </div>

              <Button
                data-testid={`delete-address-${address.address_id}`}
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAddress(address.address_id);
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Continue Button */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 glass p-4 safe-bottom"
      >
        <Button
          data-testid="continue-to-payment-btn"
          onClick={handleContinue}
          disabled={!selectedAddress}
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          متابعة إلى الدفع
        </Button>
      </motion.div>

      {/* Add Address Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="glass border-0 rounded-3xl max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">إضافة عنوان جديد</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">الاسم *</label>
              <Input
                data-testid="address-name-input"
                placeholder="الاسم الكامل"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl h-12 bg-white/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">رقم الهاتف *</label>
              <Input
                data-testid="address-phone-input"
                placeholder="777123456"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-xl h-12 bg-white/50"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">المحافظة *</label>
              <select
                data-testid="address-governorate-select"
                value={formData.governorate}
                onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                className="w-full rounded-xl h-12 bg-white/50 border border-gray-200 px-3"
              >
                <option value="">اختر المحافظة</option>
                {GOVERNORATES.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">المدينة / المنطقة *</label>
              <Input
                data-testid="address-city-input"
                placeholder="المدينة أو المنطقة"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="rounded-xl h-12 bg-white/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">وصف مختصر</label>
              <Textarea
                data-testid="address-description-input"
                placeholder="بالقرب من..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-xl bg-white/50 resize-none"
                rows={2}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm text-gray-700">تعيين كعنوان افتراضي</span>
            </label>

            <Button
              data-testid="save-address-btn"
              onClick={handleAddAddress}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
            >
              حفظ العنوان
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AddressesPage;
