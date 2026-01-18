import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, CreditCard, Building2, Wallet, Banknote, Check, Search, Truck, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const PAYMENT_METHODS = [
  { id: "alkuraimi", name: "الكريمي", icon: Building2, color: "from-green-500 to-green-600" },
  { id: "alqutaibi", name: "القطيبي", icon: Building2, color: "from-blue-500 to-blue-600" },
  { id: "jaib", name: "محفظة جيب", icon: Wallet, color: "from-purple-500 to-purple-600" },
  { id: "bank", name: "تحويل بنكي", icon: Banknote, color: "from-amber-500 to-amber-600" }
];

const PaymentPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [enableInspection, setEnableInspection] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/orders/${orderId}`, { credentials: "include" }).then(r => r.json()),
      fetch(`${API_URL}/settings/public`).then(r => r.json())
    ])
      .then(([orderData, settingsData]) => {
        setOrder(orderData);
        setSettings(settingsData);
      })
      .catch(() => toast.error("خطأ في تحميل البيانات"))
      .finally(() => setLoading(false));
  }, [orderId]);

  const getAccountInfo = (methodId) => {
    if (!settings?.bank_accounts) return null;
    const methodNames = {
      alkuraimi: "الكريمي",
      alqutaibi: "القطيبي",
      jaib: "محفظة جيب",
      bank: "تحويل بنكي"
    };
    return settings.bank_accounts.find(a => a.name === methodNames[methodId]);
  };

  // Calculate inspection fee (5 SAR per item)
  const inspectionFee = enableInspection ? (order?.items?.length || 0) * 5 : 0;
  const grandTotalWithInspection = (order?.grand_total || 0) + inspectionFee;

  const handleContinue = () => {
    if (!selectedMethod) {
      toast.error("يرجى اختيار وسيلة الدفع");
      return;
    }
    navigate(`/payment/${orderId}/confirm`, { 
      state: { 
        method: selectedMethod, 
        accountInfo: getAccountInfo(selectedMethod),
        order,
        enableInspection,
        inspectionFee,
        grandTotalWithInspection
      } 
    });
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
          onClick={() => navigate("/addresses")}
          className="rounded-xl hover:bg-white/50"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">اختر وسيلة الدفع</h1>
      </header>

      {/* Order Summary */}
      <div className="px-4 py-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-2xl p-4 mb-6"
        >
          <h2 className="font-bold text-gray-800 mb-3">ملخص الطلب</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">رقم الطلب</span>
              <span className="font-medium">{order?.order_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">المنتجات ({order?.items?.length})</span>
              <span className="font-medium">{order?.total_price?.toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">عمولة الخدمة ({settings?.commission_rate || 10}%)</span>
              <span className="font-medium">{order?.commission?.toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">رسوم الشحن</span>
              <span className="font-medium">{order?.shipping_fee?.toFixed(2)} SAR</span>
            </div>
            {enableInspection && (
              <div className="flex justify-between text-purple-600">
                <span>رسوم الفحص ({order?.items?.length} منتج)</span>
                <span className="font-medium">{inspectionFee.toFixed(2)} SAR</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-800">الإجمالي</span>
              <span className="font-bold text-lg gradient-text">{grandTotalWithInspection.toFixed(2)} SAR</span>
            </div>
          </div>
        </motion.div>

        {/* Shipping Options */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 mb-6"
        >
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            خيارات الشحن
          </h2>
          
          {/* Inspection Option */}
          <label className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={enableInspection}
              onChange={(e) => setEnableInspection(e.target.checked)}
              className="w-5 h-5 rounded mt-0.5"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-800">فحص الطلب قبل الشحن</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">سنقوم بفحص جودة المنتجات قبل شحنها إليك (5 SAR لكل منتج)</p>
            </div>
          </label>

          {/* Delivery Time */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <span className="font-medium text-gray-800">وقت التوصيل المتوقع</span>
              <p className="text-xs text-gray-500">15 - 22 يوم عمل</p>
            </div>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <h2 className="font-bold text-gray-800 mb-4">وسائل الدفع المتاحة</h2>
        <div className="space-y-3">
          {PAYMENT_METHODS.map((method, index) => {
            const accountInfo = getAccountInfo(method.id);
            const Icon = method.icon;
            
            return (
              <motion.div
                key={method.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                onClick={() => setSelectedMethod(method.id)}
                className={`glass rounded-2xl p-4 cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? "ring-2 ring-blue-600 bg-blue-50/50"
                    : "hover:bg-white/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{method.name}</h3>
                    {accountInfo && (
                      <>
                        <p className="text-sm text-gray-600 mt-1">
                          الحساب: <span dir="ltr" className="font-medium">{accountInfo.account_number}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          باسم: {accountInfo.holder_name}
                        </p>
                      </>
                    )}
                  </div>

                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === method.id
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300"
                  }`}>
                    {selectedMethod === method.id && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Note */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200"
        >
          <p className="text-sm text-amber-800 text-center">
            💰 الدفع بالريال السعودي فقط (SAR)
          </p>
        </motion.div>
      </div>

      {/* Bottom Continue Button */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 glass p-4 safe-bottom"
      >
        <Button
          data-testid="continue-to-confirm-btn"
          onClick={handleContinue}
          disabled={!selectedMethod}
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          <CreditCard className="w-5 h-5 ml-2" />
          متابعة ({grandTotalWithInspection.toFixed(2)} SAR)
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PaymentPage;
