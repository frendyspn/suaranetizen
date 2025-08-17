# QUICK DEPLOYMENT GUIDE - Shared Hosting

Panduan ini memberikan solusi cepat untuk mengatasi error 404 di shared hosting.

## 🚀 Deploy Otomatis
```bash
chmod +x deploy-shared-hosting.sh
./deploy-shared-hosting.sh
```

## 🔧 Manual Steps (jika script gagal)

### 1. Upload Files
```bash
# Upload frontend ke root domain (public_html/)
frontend/build/* → public_html/

# Upload backend ke subfolder API
backend/* → public_html/api/
```

### 2. Set Permissions
```bash
chmod -R 755 public_html/
chmod -R 775 public_html/api/storage/
chmod -R 775 public_html/api/bootstrap/cache/
chmod -R 775 public_html/api/public/uploads/
```

### 3. Update public_html/api/public/index.php
```php
<?php
// Find these lines and update paths
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
```

### 4. Update .env di public_html/api/.env
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
DB_HOST=localhost
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

### 5. Run Setup Commands
```bash
cd public_html/api/
php artisan config:clear
php artisan migrate --force
php artisan db:seed --force
php artisan config:cache
```

## 🧪 Test URLs
Setelah deployment, test URL berikut:
- `https://yourdomain.com` → Frontend
- `https://yourdomain.com/admin` → Admin dashboard
- `https://yourdomain.com/api/user/sponsors` → API test

## ⚠️ Troubleshooting Cepat

### Jika masih 404:
1. Cek file `.htaccess` ada di root dan di `api/public/`
2. Pastikan mod_rewrite aktif di hosting
3. Cek index.php paths sudah benar
4. Periksa error log cPanel

### Jika database error:
1. Pastikan database sudah dibuat di cPanel
2. Update credentials di `.env`
3. Jalankan `php artisan migrate --force`

### Jika CORS error:
1. Update `CORS_ALLOWED_ORIGINS` di `.env`
2. Pastikan domain sesuai

## 📁 Struktur Final
```
public_html/
├── index.html          (React frontend)
├── static/            (React assets)
├── .htaccess          (React routing)
└── api/               (Laravel backend)
    ├── public/
    │   ├── index.php  (Laravel entry)
    │   ├── .htaccess  (Laravel routing)
    │   └── uploads/   (File uploads)
    ├── app/
    ├── config/
    ├── .env          (Configuration)
    └── ...
```

## 🚨 Bantuan Lebih Lanjut
Jika masih bermasalah, buka file:
- `SHARED_HOSTING_TROUBLESHOOT.md` → Panduan lengkap
- `DEBUG_ROUTES.php` → Test routes
- `SHARED_HOSTING_CONFIG.php` → Konfigurasi alternatif
