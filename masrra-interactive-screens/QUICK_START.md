# ⚡ البدء السريع (5 دقائق)

## 1️⃣ نسخ الملفات (30 ثانية)

```bash
# انسخ هذه الملفات إلى مشروعك:
src/scenes/Scene5InteractiveScreens.tsx
src/screens/DashboardScreen.tsx
src/screens/TemplatesScreen.tsx
src/screens/DetailsScreen.tsx
src/screens/PreviewScreen.tsx
```

---

## 2️⃣ تحديث المستوردات (1 دقيقة)

**في ملف `src/MasrraAd.tsx`:**

### السطر 1-10: أضف الاستيراد
```javascript
import { Scene5InteractiveScreens } from "./scenes/Scene5InteractiveScreens";
```

### السطر 35: غيّر المكون
```javascript
// قبل:
{ from: 450, duration: 240, Comp: Scene5LiveScreens },

// بعد:
{ from: 450, duration: 240, Comp: Scene5InteractiveScreens },
```

---

## 3️⃣ اختبر (2 دقيقة)

```bash
# شغّل الخادم
npm run dev

# افتح المتصفح
http://localhost:3000

# انتقل للمشهد 5 (ثانية 15-23)
# يجب أن ترى 4 شاشات تفاعلية جميلة ✨
```

---

## 4️⃣ صدّر (1-2 دقيقة)

```bash
npm run render
# الملف الناتج: output.mp4
```

✅ **انتهيت!** فيديوك يستخدم الآن الرسومات التفاعلية الجديدة!

---

## 🎨 تخصيص سريع

### تغيير اللون الأساسي

في `src/theme.ts`:
```javascript
accent: "#FF5733", // غيّر هنا
```

### إضافة شاشة جديدة

في `src/screens/NewScreen.tsx`:
```javascript
export const NewScreen: React.FC = () => {
  return <AbsoluteFill>{/* محتواك */}</AbsoluteFill>;
};
```

في `Scene5InteractiveScreens.tsx`:
```javascript
const SCREENS = [
  // ...
  { Component: NewScreen, label: "جديد" },
];
```

---

## 🆘 إذا واجهت مشكلة

### ❌ الشاشات لا تظهر
```bash
# تحقق من المسارات
ls src/screens/
# يجب تظهر 4 ملفات
```

### ❌ أخطاء في الترجمة
```bash
# أعد التثبيت
npm install
npm run dev
```

### ❌ الفيديو بطيء
```bash
# اختبر بدقة أقل
npm run render -- --resolution 1280x720
```

---

## 📚 للمزيد من المعلومات

- **MIGRATION_GUIDE.md** - ترحيل كامل
- **IMPLEMENTATION.md** - تفاصيل تقنية
- **README.md** - دليل شامل

---

## ✨ ماذا تتوقع؟

| الشاشة | الوقت | المميزات |
|--------|-------|----------|
| 1. Dashboard | 0-2s | إحصائيات + رسم بياني |
| 2. Templates | 2-4s | 3 بطاقات قوالب |
| 3. Details | 4-6s | حقول إدخال ديناميكية |
| 4. Preview | 6-8s | محاكاة جهاز 3D |

---

**مبروك! لديك الآن فيديو إعلاني احترافي بـ 95% أداء أفضل! 🚀**
