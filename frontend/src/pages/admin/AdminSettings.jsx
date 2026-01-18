import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Save, Plus, Trash2, Building2, Percent, Truck, Shield } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";

const AdminSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/settings`, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      toast.error("خطأ في تحميل الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success("تم حفظ الإعدادات");
      }
    } catch (error) {
      toast.error("خطأ في حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  const addBankAccount = () => {
    setSettings({
      ...settings,
      bank_accounts: [
        ...settings.bank_accounts,
        { name: "", account_number: "", holder_name: "" }
      ]
    });
  };

  const updateBankAccount = (index, field, value) => {
    const updated = [...settings.bank_accounts];
    updated[index][field] = value;
    setSettings({ ...settings, bank_accounts: updated });
  };

  const removeBankAccount = (index) => {
    const updated = settings.bank_accounts.filter((_, i) => i !== index);
    setSettings({ ...settings, bank_accounts: updated });
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
          onClick={() => navigate("/admin")}
          className="rounded-xl hover:bg-white/50"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">الإعدادات</h1>
      </header>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Commission & Shipping */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-2xl p-4 space-y-4"
        >
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Percent className="w-5 h-5 text-blue-600" />
            العمولة والشحن
          </h2>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">نسبة العمولة (%)</label>
            <Input
              data-testid="commission-rate-input"
              type="number"
              value={settings?.commission_rate || 10}
              onChange={(e) => setSettings({ ...settings, commission_rate: parseFloat(e.target.value) })}
              className="rounded-xl h-12 bg-white/50"
              dir="ltr"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">رسوم الشحن (دولار)</label>
            <Input
              data-testid="shipping-fee-input"
              type="number"
              value={settings?.shipping_fee || 5}
              onChange={(e) => setSettings({ ...settings, shipping_fee: parseFloat(e.target.value) })}
              className="rounded-xl h-12 bg-white/50"
              dir="ltr"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings?.enable_inspection || false}
              onChange={(e) => setSettings({ ...settings, enable_inspection: e.target.checked })}
              className="w-5 h-5 rounded"
            />
            <span className="text-sm text-gray-700">تفعيل فحص الطلب قبل الشحن</span>
          </label>
        </motion.div>

        {/* Bank Accounts */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              حسابات الدفع
            </h2>
            <Button
              data-testid="add-account-btn"
              onClick={addBankAccount}
              variant="outline"
              size="sm"
              className="rounded-xl"
            >
              <Plus className="w-4 h-4 ml-1" />
              إضافة
            </Button>
          </div>

          <div className="space-y-4">
            {settings?.bank_accounts?.map((account, index) => (
              <div key={index} className="bg-white/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">حساب {index + 1}</span>
                  <Button
                    data-testid={`delete-account-${index}`}
                    onClick={() => removeBankAccount(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <Input
                  placeholder="اسم الوسيلة (مثال: الكريمي)"
                  value={account.name}
                  onChange={(e) => updateBankAccount(index, "name", e.target.value)}
                  className="rounded-xl h-10 bg-white"
                />
                <Input
                  placeholder="رقم الحساب"
                  value={account.account_number}
                  onChange={(e) => updateBankAccount(index, "account_number", e.target.value)}
                  className="rounded-xl h-10 bg-white"
                  dir="ltr"
                />
                <Input
                  placeholder="اسم صاحب الحساب"
                  value={account.holder_name}
                  onChange={(e) => updateBankAccount(index, "holder_name", e.target.value)}
                  className="rounded-xl h-10 bg-white"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 glass p-4 safe-bottom"
      >
        <Button
          data-testid="save-settings-btn"
          onClick={handleSave}
          disabled={saving}
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {saving ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5 ml-2" />
              حفظ الإعدادات
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AdminSettings;
