#!/bin/bash

# Comprehensive deployment script for shared hosting
set -e  # Exit on any error

echo "🚀 Starting deployment to shared hosting..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# 1. Build frontend
echo "� Building frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm run build

# 2. Prepare public_html structure
echo "🏗️ Preparing public_html structure..."
cd ..
mkdir -p public_html/api
mkdir -p public_html/api/public/uploads

# 3. Copy frontend build to public_html
echo "📂 Copying frontend to public_html..."
cp -r frontend/build/* public_html/
cp frontend/public/.htaccess public_html/ 2>/dev/null || echo "Frontend .htaccess not found, skipping..."

# 4. Copy backend to public_html/api
echo "� Copying backend to public_html/api..."
rsync -av --exclude='node_modules' --exclude='.git' --exclude='storage/logs/*' --exclude='storage/framework/cache/*' --exclude='storage/framework/sessions/*' --exclude='storage/framework/views/*' backend/ public_html/api/

# 5. Set proper permissions
echo "� Setting permissions..."
find public_html/ -type d -exec chmod 755 {} \;
find public_html/ -type f -exec chmod 644 {} \;
chmod -R 775 public_html/api/storage/
chmod -R 775 public_html/api/bootstrap/cache/
chmod -R 775 public_html/api/public/uploads/
chmod 644 public_html/api/public/.htaccess

# 6. Create production .env if not exists
if [ ! -f "public_html/api/.env" ]; then
    echo "📝 Creating production .env file..."
    cat > public_html/api/.env << EOF
APP_NAME="Suara Netizen"
APP_ENV=production
APP_KEY=base64:$(openssl rand -base64 32)
APP_DEBUG=false
APP_URL=https://your-domain.com

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="\${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_PUSHER_APP_KEY="\${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="\${PUSHER_HOST}"
VITE_PUSHER_PORT="\${PUSHER_PORT}"
VITE_PUSHER_SCHEME="\${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="\${PUSHER_APP_CLUSTER}"

SANCTUM_STATEFUL_DOMAINS=your-domain.com
SESSION_DOMAIN=.your-domain.com
CORS_ALLOWED_ORIGINS=https://your-domain.com
EOF
    echo "⚠️  Please update the .env file with your actual database and domain settings!"
fi

# 7. Install backend dependencies (if composer is available)
echo "📚 Installing backend dependencies..."
cd public_html/api
if command -v composer > /dev/null; then
    composer install --no-dev --optimize-autoloader
else
    echo "⚠️  Composer not found. Please install dependencies manually with: composer install --no-dev --optimize-autoloader"
fi

# 8. Clear and optimize Laravel
echo "🧹 Clearing Laravel caches..."
php artisan config:clear || echo "Config clear failed"
php artisan route:clear || echo "Route clear failed"
php artisan view:clear || echo "View clear failed"
php artisan cache:clear || echo "Cache clear failed"

echo "⚡ Optimizing for production..."
php artisan config:cache || echo "Config cache failed"
php artisan route:cache || echo "Route cache failed"
php artisan view:cache || echo "View cache failed"

# 9. Create symbolic link for storage (if not exists)
if [ ! -L "public/storage" ]; then
    echo "🔗 Creating storage link..."
    php artisan storage:link || echo "Storage link failed"
fi

# 10. Create upload directories
echo "📁 Creating upload directories..."
mkdir -p public/uploads/banners
mkdir -p public/uploads/galleries
mkdir -p public/uploads/sponsors
mkdir -p public/uploads/teams
mkdir -p public/uploads/billboards

# 11. Final permission check
echo "🔐 Final permission check..."
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
chmod -R 775 public/uploads/

cd ../..

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Post-deployment checklist:"
echo "1. ✏️  Update .env file in public_html/api/ with your database credentials"
echo "2. 🗄️  Run 'php artisan migrate' to set up the database"
echo "3. 🌱 Run 'php artisan db:seed' to populate initial data (optional)"
echo "4. 🌐 Update your domain in .env (APP_URL, SANCTUM_STATEFUL_DOMAINS, etc.)"
echo "5. 🔍 Test your site at your domain"
echo "6. 📊 Check error logs if issues occur"
echo ""
echo "🚨 Troubleshooting files created:"
echo "   - SHARED_HOSTING_TROUBLESHOOT.md"
echo "   - DEBUG_ROUTES.php"
echo "   - SHARED_HOSTING_CONFIG.php"
