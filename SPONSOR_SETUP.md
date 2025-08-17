# Sponsor Backend Setup Instructions

## 1. Run Migration
```bash
cd backend
php artisan migrate
```

## 2. Run Seeder (Optional)
```bash
php artisan db:seed --class=SponsorSeeder
```
Or run all seeders:
```bash
php artisan db:seed
```

## 3. Create Uploads Directory
Ensure the uploads directory exists and has proper permissions:
```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

## API Endpoints Created

### Admin Routes (Requires Authentication)
- `GET /api/admin/sponsors` - List all sponsors
- `POST /api/admin/sponsors` - Create new sponsor
- `GET /api/admin/sponsors/{id}` - Show specific sponsor  
- `POST /api/admin/sponsors/{id}` - Update sponsor (supports file upload)
- `DELETE /api/admin/sponsors/{id}` - Delete sponsor

### Public Routes  
- `GET /api/user/sponsors` - Get sponsors for public display

## Database Schema

### sponsors table
- `id` - Primary key
- `title` - Sponsor name/title (string, required)
- `image` - Image filename (string, required) 
- `created_at` - Timestamp
- `updated_at` - Timestamp

## File Upload
- Supported formats: JPG, PNG, GIF
- Maximum file size: 2MB
- Files stored in: `public/uploads/`
- Automatic filename generation with timestamp and random string

## Default Seeder Data
- Sponsor 1 (sponsor1.jpg)
- Sponsor 2 (sponsor2.jpg)
- Sponsor 3 (sponsor3.jpg)
- Partner Media (partner-media.jpg)
- Corporate Sponsor (corporate-sponsor.jpg)

Note: You need to manually add corresponding image files to `public/uploads/` directory for the seeder data to display properly.
