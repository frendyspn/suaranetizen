# KONFIGURASI SHARED HOSTING UNTUK CI/CD DEPLOYMENT

Panduan ini menjelaskan konfigurasi yang diperlukan untuk deployment otomatis menggunakan GitHub Actions ke shared hosting.

## 📁 Struktur Direktori Shared Hosting

Setelah CI/CD deployment, struktur di shared hosting akan menjadi:

```
root/
├── public_html/               # Document root (Web accessible)
│   ├── index.html            # React frontend
│   ├── static/               # React assets
│   ├── .htaccess            # React routing
│   └── api/                 # Laravel public folder
│       ├── index.php        # Laravel entry point (modified)
│       ├── .htaccess        # Laravel routing
│       └── uploads/         # File uploads
└── laravel_app/             # Laravel core (Not web accessible)
    ├── app/
    ├── config/
    ├── database/
    ├── routes/
    ├── storage/
    ├── vendor/
    ├── .env                 # Production environment file
    └── ...
```

## 🔧 Konfigurasi Yang Diperlukan di Shared Hosting

### 1. File .env di `laravel_app/.env`
Setelah deployment pertama, update file ini dengan:

```env
# Update dengan domain Anda
APP_URL=https://yourdomain.com
APP_KEY=base64:GENERATE_NEW_KEY_HERE

# Database credentials dari cPanel
DB_HOST=localhost
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# Update domain untuk CORS
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
SESSION_DOMAIN=.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 2. Generate Application Key
Jalankan sekali setelah deployment pertama:
```bash
cd laravel_app
php artisan key:generate
```

### 3. Database Setup
```bash
cd laravel_app
php artisan migrate --force
php artisan db:seed --force
```

### 4. File Permissions
CI/CD akan set otomatis, tapi jika perlu manual:
```bash
chmod -R 755 laravel_app/
chmod -R 775 laravel_app/storage/
chmod -R 775 laravel_app/bootstrap/cache/
chmod -R 775 public_html/api/uploads/
```

### 5. Symlink Storage (jika perlu)
```bash
cd laravel_app
php artisan storage:link
```

## ⚙️ GitHub Secrets yang Diperlukan

Di repository GitHub, tambahkan secrets berikut di **Settings > Secrets and Variables > Actions**:

### Required Secrets:
```
FTP_HOST=your-ftp-host.com
FTP_USERNAME=your-ftp-username
FTP_PASSWORD=your-ftp-password
```

### Optional SSH Secrets (jika hosting support SSH):
```
SSH_HOST=your-ssh-host.com
SSH_USERNAME=your-ssh-username
SSH_PASSWORD=your-ssh-password
SSH_PORT=22
```

### Variables (optional):
```
ENABLE_SSH_COMMANDS=true  # Set to enable post-deployment commands
```

## 🚀 Proses Deployment Otomatis

1. **Push ke branch main** → Trigger CI/CD
2. **Build frontend** → npm run build
3. **Install backend dependencies** → composer install
4. **Prepare deployment structure**:
   - Frontend → `public_html/`
   - Backend core → `laravel_app/`
   - Laravel public → `public_html/api/`
   - Custom index.php dengan path yang benar
5. **Deploy via FTP** → Upload semua ke hosting
6. **Post-deployment** (jika SSH enabled):
   - Clear caches
   - Optimize for production
   - Set permissions

## 📝 Setup Awal di Shared Hosting

### Langkah 1: Persiapan Database
1. Login ke cPanel
2. Buat database MySQL baru
3. Buat user database dan assign ke database
4. Catat: DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD

### Langkah 2: Setelah Deployment Pertama
```bash
# SSH ke hosting (jika tersedia) atau melalui cPanel File Manager
cd laravel_app

# Generate app key
php artisan key:generate

# Setup database
php artisan migrate --force
php artisan db:seed --force

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Langkah 3: Update .env
Edit `laravel_app/.env` dengan kredensial database yang benar.

## 🔍 Testing Deployment

Setelah deployment, test URL berikut:

1. **Frontend**: `https://yourdomain.com`
2. **Admin**: `https://yourdomain.com/admin`
3. **API Test**: `https://yourdomain.com/api/user/sponsors`

## ⚠️ Troubleshooting

### Jika 404 Error:
1. Cek file `public_html/api/index.php` ada dan path benar
2. Cek file `.htaccess` ter-upload dengan benar
3. Pastikan mod_rewrite aktif di hosting

### Jika Database Error:
1. Cek credentials di `laravel_app/.env`
2. Pastikan database sudah dibuat di cPanel
3. Jalankan migrate: `php artisan migrate --force`

### Jika Permission Error:
```bash
chmod -R 775 laravel_app/storage/
chmod -R 775 laravel_app/bootstrap/cache/
chmod -R 775 public_html/api/uploads/
```

## 💡 Tips Optimasi

1. **Monitoring**: Set up error logging di cPanel
2. **Backup**: Schedule database backup di cPanel
3. **SSL**: Aktifkan SSL certificate untuk HTTPS
4. **Caching**: Enable opcache jika tersedia
5. **CDN**: Gunakan CDN untuk assets static

## 🔄 Rollback Strategy

Jika deployment bermasalah:
1. Git revert commit yang bermasalah
2. Push ke main → akan trigger re-deployment
3. Atau manual restore dari backup cPanel

---

**Catatan**: Struktur ini menggunakan praktik terbaik shared hosting dengan memisahkan Laravel core dari document root untuk keamanan yang lebih baik.
