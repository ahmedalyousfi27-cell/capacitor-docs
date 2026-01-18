import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, Upload, Check, Camera, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const PaymentConfirmPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const { method, accountInfo, order } = location.state || {};
  
  const [formData, setFormData] = useState({
    sender_name: "",
    payment_reference: "",
    receipt_image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, receipt_image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.sender_name || !formData.payment_reference) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          payment_method: method,
          sender_name: formData.sender_name,
          payment_reference: formData.payment_reference,
          receipt_image: formData.receipt_image || ""
        })
      });

      if (response.ok) {
        setSuccess(true);
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        throw new Error("Payment submission failed");
      }
    } catch (error) {
      toast.error("خطأ في تأكيد الدفع");
    } finally {
      setSubmitting(false);
    }
  };

  const methodNames = {
    alkuraimi: "الكريمي",
    alqutaibi: "القطيبي",
    jaib: "محفظة جيب",
    bank: "تحويل بنكي"
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="glass rounded-3xl p-8 text-center max-w-sm w-full"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">تم استلام طلبك!</h1>
          <p className="text-gray-600 mb-6">سيتم مراجعة التحويل وتحديث حالة الطلب قريباً</p>
          
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-600">رقم الطلب</p>
            <p className="font-bold text-lg text-blue-800">{orderId}</p>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            الحالة الحالية: <span className="text-amber-600 font-medium">قيد المراجعة</span>
          </p>
          
          <div className="space-y-3">
            <Button
              data-testid="view-orders-btn"
              onClick={() => navigate("/orders")}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
            >
              متابعة الطلبات
            </Button>
            <Button
              data-testid="continue-shopping-btn"
              onClick={() => navigate("/browse")}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              متابعة التسوق
            </Button>
          </div>
        </motion.div>
      </motion.div>
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
          onClick={() => navigate(`/payment/${orderId}`)}
          className="rounded-xl hover:bg-white/50"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">تأكيد الدفع</h1>
      </header>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Payment Info Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-2xl p-4"
        >
          <h2 className="font-bold text-gray-800 mb-3">معلومات التحويل</h2>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white">
            <p className="text-white/80 text-sm">وسيلة الدفع</p>
            <p className="font-bold text-lg">{methodNames[method]}</p>
            {accountInfo && (
              <>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-white/80 text-sm">رقم الحساب</p>
                  <p className="font-bold text-lg" dir="ltr">{accountInfo.account_number}</p>
                </div>
                <div className="mt-2">
                  <p className="text-white/80 text-sm">باسم</p>
                  <p className="font-bold">{accountInfo.holder_name}</p>
                </div>
              </>
            )}
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-white/80 text-sm">المبلغ المطلوب</p>
              <p className="font-bold text-2xl">${order?.grand_total?.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-4 space-y-4"
        >
          <h2 className="font-bold text-gray-800">بيانات التحويل</h2>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">اسم المرسل *</label>
            <Input
              data-testid="sender-name-input"
              placeholder="الاسم الكامل للمرسل"
              value={formData.sender_name}
              onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
              className="rounded-xl h-12 bg-white/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">رقم التحويل / المرجع *</label>
            <Input
              data-testid="payment-reference-input"
              placeholder="رقم عملية التحويل"
              value={formData.payment_reference}
              onChange={(e) => setFormData({ ...formData, payment_reference: e.target.value })}
              className="rounded-xl h-12 bg-white/50"
              dir="ltr"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">صورة الإيصال (اختياري)</label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {previewImage ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={previewImage} alt="Receipt" className="w-full h-48 object-cover" />
                <button
                  onClick={() => {
                    setPreviewImage(null);
                    setFormData({ ...formData, receipt_image: null });
                  }}
                  className="absolute top-2 left-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                data-testid="upload-receipt-btn"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <Camera className="w-8 h-8" />
                <span className="text-sm">اضغط لرفع صورة الإيصال</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            data-testid="confirm-payment-btn"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5 ml-2" />
                تم التحويل ✅
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PaymentConfirmPage;
