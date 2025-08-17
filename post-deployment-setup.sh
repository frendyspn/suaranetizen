#!/bin/bash

# POST-DEPLOYMENT SCRIPT FOR SHARED HOSTING
# Jalankan script ini setelah CI/CD deployment selesai
# Upload script ini ke laravel_app/ dan jalankan via cPanel Terminal atau SSH

echo "🚀 Post-deployment setup for Suara Netizen"
echo "=========================================="

# Check current directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: Please run this script from laravel_app directory"
    echo "Current directory: $(pwd)"
    echo "Looking for artisan file..."
    exit 1
fi

echo "✅ Found artisan file, proceeding with setup..."

# 1. Check PHP version
echo "📋 Checking PHP version..."
php -v

# 2. Generate application key if not exists
echo "🔑 Generating application key..."
php artisan key:generate --force

# 3. Check database connection
echo "🗄️ Testing database connection..."
php artisan migrate:status

# 4. Clear all caches
echo "🧹 Clearing all caches..."
php artisan config:clear
php artisan route:clear
php artisan cache:clear
php artisan view:clear

# 5. Run migrations
echo "🗄️ Running database migrations..."
php artisan migrate --force

# 6. Run seeders
echo "🌱 Running database seeders..."
php artisan db:seed --class=SponsorSeeder --force

# 7. Create storage link
echo "🔗 Creating storage symbolic link..."
php artisan storage:link

# 8. Cache for production
echo "⚡ Caching configurations for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 9. Set file permissions
echo "🔒 Setting file permissions..."
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/

# Create upload directories if not exist
mkdir -p ../public_html/api/uploads/banners
mkdir -p ../public_html/api/uploads/galleries  
mkdir -p ../public_html/api/uploads/sponsors
mkdir -p ../public_html/api/uploads/teams
mkdir -p ../public_html/api/uploads/billboards

chmod -R 775 ../public_html/api/uploads/

# 10. Test routes
echo "🧪 Testing API routes..."
php artisan route:list | grep api

# 11. Check .env configuration
echo "📝 Checking .env configuration..."
echo "APP_ENV: $(grep '^APP_ENV=' .env | cut -d'=' -f2)"
echo "APP_DEBUG: $(grep '^APP_DEBUG=' .env | cut -d'=' -f2)"
echo "APP_URL: $(grep '^APP_URL=' .env | cut -d'=' -f2)"
echo "DB_DATABASE: $(grep '^DB_DATABASE=' .env | cut -d'=' -f2)"

# 12. Final health check
echo "🏥 Running health check..."
php artisan about

echo ""
echo "✅ Post-deployment setup completed!"
echo ""
echo "📋 Manual checklist:"
echo "1. ✏️  Verify .env file has correct database credentials"
echo "2. 🌐 Update APP_URL with your actual domain"
echo "3. 🔒 Update SANCTUM_STATEFUL_DOMAINS with your domain"
echo "4. 🌐 Update CORS_ALLOWED_ORIGINS with your domain"
echo "5. 🧪 Test these URLs:"
echo "   - https://yourdomain.com (Frontend)"
echo "   - https://yourdomain.com/admin (Admin)"
echo "   - https://yourdomain.com/api/user/sponsors (API)"
echo ""
echo "🚨 If you encounter issues:"
echo "   - Check error logs in cPanel"
echo "   - Verify file permissions are correct"
echo "   - Ensure mod_rewrite is enabled"
echo "   - Contact hosting support if needed"
