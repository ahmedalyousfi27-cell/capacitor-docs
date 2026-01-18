# وصول | Wo6ol - PRD Document

## المشروع
**الاسم:** وصول | Wo6ol  
**النوع:** Web Application (Arabic RTL)  
**الهدف:** منصة وساطة ذكية للشراء من موقع AliExpress  
**التاريخ:** 2026-01-18

---

## User Personas
1. **المتسوق اليمني** - يرغب بالشراء من AliExpress بسهولة عبر وسيط محلي
2. **مدير المنصة** - يدير الطلبات ويتابع التحويلات ويحدث حالات الطلبات

---

## Core Requirements (Static)
- تصفح منتجات AliExpress عبر iframe
- سلة تسوق داخلية
- دفع يدوي بوسائل محلية (الكريمي، القطيبي، جيب، تحويل بنكي)
- تتبع حالة الطلبات
- لوحة تحكم إدارية
- واجهة عربية RTL
- تسجيل دخول عبر Google

---

## What's Been Implemented ✅
### 2026-01-18
- [x] شاشة البداية (Splash) مع أنيميشن
- [x] تسجيل دخول عبر Google (Emergent Auth)
- [x] صفحة تصفح AliExpress مع iframe
- [x] إضافة منتجات للسلة (modal)
- [x] صفحة سلة التسوق
- [x] إدارة عناوين التوصيل
- [x] صفحة اختيار وسيلة الدفع
- [x] صفحة تأكيد الدفع ورفع الإيصال
- [x] صفحة تتبع الطلبات مع Timeline
- [x] صفحة الملف الشخصي
- [x] لوحة تحكم إدارية
- [x] إدارة الطلبات (Admin)
- [x] إعدادات النظام (Admin)
- [x] API كامل للـ Backend
- [x] تصميم Glassmorphism + RTL
- [x] رابط واتساب مباشر (+967736536150)

---

## Tech Stack
- **Frontend:** React + TailwindCSS + Framer Motion + Shadcn/UI
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Auth:** Emergent Google OAuth
- **Font:** Tajawal (Arabic)

---

## Prioritized Backlog

### P0 - Critical (Implemented ✅)
- [x] User authentication
- [x] Cart management
- [x] Order creation
- [x] Payment submission
- [x] Admin dashboard

### P1 - High Priority
- [ ] إشعارات حالة الطلب عبر البريد/SMS
- [ ] تاريخ الطلبات المفصل
- [ ] البحث في المنتجات

### P2 - Nice to Have
- [ ] تكامل مع بوابة دفع إلكتروني
- [ ] تطبيق موبايل (React Native)
- [ ] تتبع شحن حقيقي
- [ ] نظام نقاط ومكافآت

---

## Next Tasks
1. تحسين تجربة إضافة المنتج للسلة
2. إضافة إشعارات البريد الإلكتروني
3. تحسين أداء تحميل الصفحات
4. إضافة صفحة المساعدة والدعم
