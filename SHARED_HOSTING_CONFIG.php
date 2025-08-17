<?php

/*
|--------------------------------------------------------------------------
| SHARED HOSTING CONFIGURATION
|--------------------------------------------------------------------------
| File ini berisi konfigurasi khusus untuk shared hosting
| Copy configurations ini ke file yang sesuai
*/

// 1. UPDATE index.php (di public_html shared hosting)
// Ganti path relatif dengan absolute path

/*
require_once __DIR__.'/../../suaranetizen_app/vendor/autoload.php';
$app = require_once __DIR__.'/../../suaranetizen_app/bootstrap/app.php';
*/

// 2. UPDATE .env file untuk production
/*
APP_NAME="Suara Netizen"
APP_ENV=production
APP_KEY=base64:your-app-key-here
APP_DEBUG=false
APP_TIMEZONE=Asia/Jakarta
APP_URL=https://yourdomain.com

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync

CACHE_STORE=file
CACHE_PREFIX=

MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
*/

// 3. Tambah CORS Headers jika diperlukan
// Tambah di app/Http/Middleware/Cors.php

class Cors
{
    public function handle($request, Closure $next)
    {
        return $next($request)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
}

// 4. Register middleware di bootstrap/app.php
/*
->withMiddleware(function (Middleware $middleware): void {
    $middleware->append([
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        \Illuminate\Http\Middleware\HandleCors::class,
        \App\Http\Middleware\Cors::class, // Add this
    ]);
})
*/

// 5. Alternative .htaccess untuk shared hosting yang strict
/*
<IfModule mod_rewrite.c>
    Options +FollowSymLinks -Indexes
    RewriteEngine On
    
    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} ^(.+)$
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
    
    # Handle CORS preflight requests
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
    
    # Remove trailing slash
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]
    
    # Handle Front Controller
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
    
    # Prevent access to sensitive files
    <FilesMatch "^\.">
        Order allow,deny
        Deny from all
    </FilesMatch>
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
*/
