# SETUP ASSET UPLOADS UNTUK SHARED HOSTING

Panduan ini menjelaskan bagaimana setting routing dan akses gambar upload untuk struktur shared hosting tanpa subdomain.

## 📁 Struktur File di Shared Hosting

```
domain.com/
├── public_html/                    # Document root (web accessible)
│   ├── index.html                 # React frontend
│   ├── static/                    # React assets
│   └── api/                       # Laravel public folder
│       ├── index.php              # Laravel entry point
│       ├── .htaccess              # Laravel routing
│       └── uploads/               # Upload files (accessible via web)
│           ├── sponsors/          # Sponsor images
│           ├── galleries/         # Gallery images
│           ├── teams/             # Team photos
│           ├── banners/           # Banner images
│           └── billboards/        # Billboard images
└── laravel_app/                   # Laravel core (not web accessible)
    ├── app/, config/, etc.
    └── storage/                   # Laravel storage (not web accessible)
```

## 🔧 Konfigurasi Backend

### 1. File: `config/filesystems.php`
```php
'public_uploads' => [
    'driver' => 'local',
    'root' => base_path('../public_html/api/uploads'),  // Path ke uploads
    'url' => env('APP_URL').'/api/uploads',             // URL akses
    'visibility' => 'public',
],
```

### 2. File: `routes/web.php` 
Menambahkan route untuk serving files:
```php
// Route untuk serving files dari public_uploads disk
Route::get('/api/uploads/{type}/{filename}', function ($type, $filename) {
    $disk = 'public_uploads';
    $path = $type . '/' . $filename;
    
    if (!Storage::disk($disk)->exists($path)) {
        abort(404);
    }
    
    $file = Storage::disk($disk)->get($path);
    $mimeType = Storage::disk($disk)->mimeType($path);
    
    return response($file, 200)->header('Content-Type', $mimeType);
})->where(['type' => '[a-z]+', 'filename' => '[A-Za-z0-9\-_.]+']);
```

### 3. Models dengan URL Accessor
Contoh di `app/Models/Sponsor.php`:
```php
public function getImageUrlAttribute()
{
    if ($this->image) {
        // URL: domain.com/api/uploads/sponsors/filename.jpg
        return asset('api/uploads/' . $this->image);
    }
    return null;
}
```

### 4. Controllers menggunakan public_uploads disk
```php
// Store file
$imagePath = $request->file('image')->store('sponsors', 'public_uploads');

// Delete file
Storage::disk('public_uploads')->delete($sponsor->image);

// Check if exists
Storage::disk('public_uploads')->exists($sponsor->image);
```

## 🌐 URL Akses File

Dengan konfigurasi di atas, file dapat diakses via:

- **Sponsor images**: `https://domain.com/api/uploads/sponsors/filename.jpg`
- **Gallery images**: `https://domain.com/api/uploads/galleries/filename.jpg`
- **Team photos**: `https://domain.com/api/uploads/teams/filename.jpg`
- **Banner images**: `https://domain.com/api/uploads/banners/filename.jpg`
- **Billboard images**: `https://domain.com/api/uploads/billboards/filename.jpg`

## ✅ Keuntungan Struktur Ini

1. **File Accessible**: Upload files bisa diakses langsung via URL
2. **Organized**: File terorganisir dalam folder berdasarkan type
3. **Secure**: Laravel core tetap di luar document root
4. **CDN Ready**: URL absolut siap untuk CDN
5. **No Subdomain**: Tidak perlu subdomain terpisah

## 🧪 Testing Upload & Access

### 1. Test Upload via API
```bash
curl -X POST https://domain.com/api/admin/sponsors \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Sponsor" \
  -F "image=@/path/to/image.jpg"
```

### 2. Test File Access
```bash
# Check if file accessible
curl -I https://domain.com/api/uploads/sponsors/filename.jpg

# Should return 200 OK with proper Content-Type
```

### 3. Test dari Frontend
```javascript
// Di React component
const sponsor = await api.get('/api/user/sponsors');
console.log(sponsor.data[0].image_url); 
// Output: https://domain.com/api/uploads/sponsors/filename.jpg

// Use in img tag
<img src={sponsor.image_url} alt={sponsor.title} />
```

## 🔒 Security & Performance

### 1. File Validation
Controllers sudah include validation:
```php
'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
```

### 2. .htaccess untuk uploads (optional)
Buat file `public_html/api/uploads/.htaccess`:
```apache
# Prevent direct access to sensitive files
<Files "*.php">
    Order Allow,Deny
    Deny from all
</Files>

# Enable GZIP compression for images
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE image/jpeg
    AddOutputFilterByType DEFLATE image/png
    AddOutputFilterByType DEFLATE image/gif
</IfModule>

# Browser caching for images
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
</IfModule>
```

### 3. File Size & Type Control
```php
// Max file size in php.ini or .htaccess
upload_max_filesize = 5M
post_max_size = 5M
max_execution_time = 60
```

## 🚨 Troubleshooting

### File Upload Gagal:
1. **Check permissions**: `chmod 775 public_html/api/uploads/`
2. **Check PHP limits**: `upload_max_filesize`, `post_max_size`
3. **Check disk space**: Pastikan hosting masih ada space

### File Tidak Bisa Diakses:
1. **Check URL structure**: `domain.com/api/uploads/type/filename`
2. **Check file exists**: Via cPanel File Manager
3. **Check .htaccess**: Pastikan tidak memblok akses file

### Permission Errors:
```bash
# Set proper permissions
chmod -R 755 public_html/api/uploads/
chown -R username:username public_html/api/uploads/
```

---

**✨ Dengan setup ini, semua file upload akan tersimpan dan dapat diakses dengan struktur URL yang konsisten di shared hosting tanpa perlu subdomain tambahan!**
