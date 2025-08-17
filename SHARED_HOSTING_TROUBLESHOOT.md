# Troubleshooting 404 Error di Shared Hosting

## 🚨 **Kemungkinan Masalah dan Solusi**

### 1. **Struktur Direktori Salah**
**Masalah**: File Laravel tidak di-upload ke direktori yang tepat
**Solusi**:
```
Shared Hosting Structure:
public_html/
├── index.php (dari folder public Laravel)
├── .htaccess (dari folder public Laravel)
├── uploads/ (untuk file uploads)
├── css/, js/, dll (assets dari public)
└── app/ (seluruh aplikasi Laravel di luar public_html)
    ├── app/
    ├── config/
    ├── database/
    ├── routes/
    └── vendor/
```

### 2. **Path Configuration**
**File**: `bootstrap/app.php` atau index.php perlu disesuaikan
**Solusi**: Update path ke Laravel app

### 3. **API Routes Tidak Dikenali**
**Masalah**: Route `/api/user/sponsors` return 404
**Solusi**: 

#### A. Pastikan RouteServiceProvider benar
```php
// app/Providers/RouteServiceProvider.php
public function boot()
{
    $this->routes(function () {
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));
            
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    });
}
```

#### B. Clear cache routes
```bash
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

### 4. **PHP Version Compatibility**
**Cek**: Pastikan shared hosting support PHP 8.1+
**Laravel 11**: Requires PHP 8.2+

### 5. **Composer Dependencies**
**Masalah**: vendor/ folder tidak ter-upload atau incomplete
**Solusi**:
```bash
composer install --no-dev --optimize-autoloader
```

### 6. **Environment Configuration**
**File**: `.env` file configuration
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 7. **Permissions**
```bash
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
chmod -R 755 public/uploads/
```

## 🛠️ **Langkah Debugging**

### 1. **Test Routes**
Buat file test untuk cek routes:
```php
// routes/web.php - Tambahkan untuk testing
Route::get('/test', function () {
    return 'Laravel is working!';
});

Route::get('/test-api', function () {
    return response()->json(['message' => 'API is working!']);
});
```

### 2. **Check URL Pattern**
- URL Local: `http://localhost:8000/api/user/sponsors`
- URL Shared: `https://yourdomain.com/api/user/sponsors`

### 3. **Enable Debug Mode (Sementara)**
```env
APP_DEBUG=true
```
Untuk melihat error detail (matikan setelah debugging)

### 4. **Log Errors**
```php
// Check Laravel logs
storage/logs/laravel.log
```

## 📋 **Checklist Upload ke Shared Hosting**

- [ ] Upload semua files kecuali `node_modules/`
- [ ] Files dari folder `public/` ke `public_html/`
- [ ] Rest of Laravel app ke folder di atas `public_html/`
- [ ] Update `index.php` path ke Laravel app
- [ ] Set proper file permissions
- [ ] Upload `.env` file dengan config production
- [ ] Run `composer install` di shared hosting
- [ ] Run `php artisan migrate`
- [ ] Test basic Laravel route
- [ ] Test API routes

## 🔧 **Modified .htaccess untuk Shared Hosting**

Jika masalah persist, coba .htaccess ini:

```apache
<IfModule mod_rewrite.c>
    Options -MultiViews -Indexes
    RewriteEngine On
    
    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} ^(.+)$
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
    
    # Redirect Trailing Slashes If Not A Folder
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]
    
    # Handle Front Controller
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```
