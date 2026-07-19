# 🌐 Xray / V2ray Multi-Protocol Management Panel

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/python-3.9%20%7C%203.10%20%7C%203.11-blue)](https://www.python.org/)
[![Xray-Core](https://img.shields.io/badge/Xray--Core-Latest-orange)](https://github.com/XTLS/Xray-core)

یک پنل مدیریت هوشمند، سبک و سریع برای مدیریت کانکشن‌ها و پروتکل‌های **Xray** و **V2ray**. این پروژه با هدف ساده‌سازی فرآیند ساخت، محدودسازی و مانیتورینگ کاربران در سرورهای لینوکس طراحی شده است.

---

## ✨ ویژگی‌های برجسته (Features)

* **پشتیبانی از چند پروتکل:** مدیریت هم‌زمان پروتکل‌های محبوب نظیر VLESS, VMess, Trojan و Shadowsocks.
* **مدیریت پیشرفته کاربران:** قابلیت ساخت، ویرایش، حذف و غیرفعال‌سازی آنی اکانت‌ها.
* **محدودیت حجم و زمان:** تعیین سقف ترافیک مصرفی (Traffic Limit) و تاریخ انقضا برای هر کاربر.
* **مانیتورینگ زنده (Live Monitoring):** مشاهده میزان مصرف پهنای باند و وضعیت اتصال کاربران در لحظه.
* **سیستم مدیریت ساب‌سکریپشن:** تولید خودکار لینک‌های اتصال و لینک ساب (Subscription Link) استاندارد.
* **امنیت بالا:** بهینه‌سازی شده بر پایه آخرین متدهای رمزنگاری XTLS و TLS.

---

## 📂 ساختار پروژه (Project Structure)

```text
xray-v2ray-panel/
├── core/                   # ماژول‌های اصلی ارتباط با هسته Xray
│   ├── xray_controller.py  # کنترلر استارت، استاپ و کانفیگ Xray
│   └── user_manager.py     # مدیریت افزودن و حذف کاربران در کانفیگ
├── database/               # بخش ذخیره‌سازی اطلاعات کاربران و دیتابیس
├── templates/              # فایل‌های فرانت‌اند و رابط کاربری (HTML/CSS)
├── config.json.template    # قالب اولیه فایل تنظیمات Xray
├── app.py                  # هسته اصلی و وب‌سرور پنل مدیریتی
└── README.md               # راهنمای پروژه
