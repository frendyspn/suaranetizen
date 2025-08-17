# 🚀 CI/CD Deployment Guide - Suara Netizen

## Overview
Proyek Suara Netizen menggunakan GitHub Actions untuk deployment otomatis ke shared hosting dengan struktur yang aman dan optimal.

## 📁 Arsitektur Deployment

### Struktur di Shared Hosting:
```
root/
├── public_html/           # Document root (accessible via web)
│   ├── index.html        # React app
│   ├── static/           # React assets
│   ├── .htaccess         # React routing
│   └── api/              # Laravel public folder only
│       ├── index.php     # Custom Laravel entry point
│       ├── .htaccess     # API routing
│       └── uploads/      # File uploads
└── laravel_app/          # Laravel core (secure, not web accessible)
    ├── app/, config/, routes/, etc.
    ├── .env              # Production configuration
    └── vendor/           # Dependencies
```

## 🔧 Setup GitHub Actions

### 1. Repository Secrets
Di GitHub repo, pergi ke **Settings > Secrets and Variables > Actions** dan tambahkan:

**Required FTP Secrets:**
```
FTP_HOST=your-hosting-ftp.com
FTP_USERNAME=your-ftp-username
FTP_PASSWORD=your-ftp-password
```

**Optional SSH Secrets** (jika hosting support SSH):
```
SSH_HOST=your-hosting-ssh.com
SSH_USERNAME=your-ssh-username
SSH_PASSWORD=your-ssh-password
SSH_PORT=22
```

**Variables:**
```
ENABLE_SSH_COMMANDS=true  # Enable post-deployment commands
```

### 2. Workflow Configuration
File `.github/workflows/deploy.yml` sudah dikonfigurasi untuk:
- ✅ Build React frontend
- ✅ Install Laravel dependencies
- ✅ Struktur deployment yang benar
- ✅ Custom index.php untuk shared hosting
- ✅ Upload via FTP
- ✅ Post-deployment commands (jika SSH tersedia)

## 🎯 Deployment Process

### Automatic Deployment:
1. **Push ke branch `main`** → Trigger GitHub Actions
2. **Build & Deploy** → Otomatis upload ke shared hosting
3. **Post-setup** → Jalankan script setup di hosting

### Manual Deployment:
```bash
# Trigger manual deployment
git push origin main

# Atau trigger manual di GitHub Actions tab
```

## ⚙️ Setup di Shared Hosting

### Langkah 1: Persiapan Database
1. **cPanel > MySQL Databases**
2. Buat database baru
3. Buat user dan assign ke database
4. Catat credentials untuk `.env`

### Langkah 2: Setelah Deployment Pertama
Upload dan jalankan `post-deployment-setup.sh`:

```bash
# Upload post-deployment-setup.sh ke laravel_app/
# Via SSH atau cPanel Terminal:
cd laravel_app
chmod +x post-deployment-setup.sh
./post-deployment-setup.sh
```

### Langkah 3: Update .env
Edit `laravel_app/.env`:
```env
APP_URL=https://yourdomain.com
DB_HOST=localhost
DB_DATABASE=your_actual_db_name
DB_USERNAME=your_actual_db_user
DB_PASSWORD=your_actual_db_password
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

## 🧪 Testing Deployment

Setelah setup, test URL berikut:

1. **🌐 Frontend**: `https://yourdomain.com`
2. **👨‍💼 Admin**: `https://yourdomain.com/admin`
3. **🔌 API Test**: `https://yourdomain.com/api/user/sponsors`

## 🔄 Development Workflow

### Branch Strategy:
```bash
# Development
git checkout -b feature/new-feature
# Make changes
git commit -m "Add new feature"
git push origin feature/new-feature

# Create PR to main
# After merge → Auto deployment!
```

### Hotfix:
```bash
git checkout -b hotfix/urgent-fix
# Fix issue
git commit -m "Fix urgent issue"
git push origin hotfix/urgent-fix
# Merge to main → Immediate deployment
```

## 🚨 Troubleshooting

### Jika Deployment Gagal:
1. **Cek GitHub Actions logs** untuk error details
2. **Verify FTP credentials** di repository secrets
3. **Check hosting space** dan permissions

### Jika Website 404:
1. **Cek file structure** di hosting
2. **Verify .htaccess files** ter-upload
3. **Test mod_rewrite** di hosting
4. **Run post-deployment script** jika belum

### Jika API Error:
1. **Check .env configuration** di `laravel_app/`
2. **Verify database connection**
3. **Run migrations**: `php artisan migrate --force`
4. **Clear caches**: `php artisan config:clear`

## 📊 Monitoring & Maintenance

### Log Files:
- **Laravel logs**: `laravel_app/storage/logs/`
- **Hosting error logs**: cPanel > Error Logs
- **GitHub Actions**: Repository > Actions tab

### Regular Tasks:
```bash
# Clear caches (monthly)
php artisan cache:clear
php artisan config:clear

# Update dependencies (as needed)
composer update --no-dev --optimize-autoloader

# Database maintenance
php artisan queue:work  # if using queues
```

## 🔒 Security Best Practices

✅ **Laravel core** di luar document root  
✅ **Environment variables** in secure `.env`  
✅ **File permissions** properly set  
✅ **HTTPS** enforced  
✅ **CORS** configured  
✅ **Input validation** implemented  

## 📚 Useful Commands

```bash
# Check deployment status
php artisan about

# List all routes
php artisan route:list

# Test database connection
php artisan migrate:status

# Clear all caches
php artisan optimize:clear

# Cache for production
php artisan optimize
```

## 🆘 Support

Jika mengalami masalah:
1. **Check documentation files**:
   - `CICD_SHARED_HOSTING_CONFIG.md`
   - `SHARED_HOSTING_TROUBLESHOOT.md`
2. **Review GitHub Actions logs**
3. **Check hosting error logs**
4. **Contact hosting support** untuk mod_rewrite/PHP version

---

**🎉 Happy Deploying!** Dengan setup ini, setiap push ke main akan otomatis deploy ke production dengan struktur yang aman dan optimal.
