# TESTING SPONSOR CRUD - Admin Panel

## Test Checklist untuk Admin Sponsor Management

### ✅ **1. List Sponsors (GET /admin/sponsors)**
```bash
curl -X GET "https://suaranetizen.co.id/api/admin/sponsors" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "Sponsor Name",
    "image": "sponsors/filename.jpg",
    "image_url": "https://suaranetizen.co.id/api/uploads/sponsors/filename.jpg",
    "created_at": "2025-08-19T...",
    "updated_at": "2025-08-19T..."
  }
]
```

### ✅ **2. Create Sponsor (POST /admin/sponsors)**
```bash
curl -X POST "https://suaranetizen.co.id/api/admin/sponsors" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "title=Test Sponsor" \
  -F "image=@/path/to/image.jpg"
```

**Expected Response:**
```json
{
  "id": 2,
  "title": "Test Sponsor",
  "image": "sponsors/generated-filename.jpg",
  "image_url": "https://suaranetizen.co.id/api/uploads/sponsors/generated-filename.jpg",
  "created_at": "2025-08-19T...",
  "updated_at": "2025-08-19T..."
}
```

### ✅ **3. Show Single Sponsor (GET /admin/sponsors/{id})**
```bash
curl -X GET "https://suaranetizen.co.id/api/admin/sponsors/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

### ✅ **4. Update Sponsor (PUT /admin/sponsors/{id})**
**Via Frontend (with _method):**
```javascript
const formData = new FormData();
formData.append('title', 'Updated Sponsor Name');
formData.append('image', imageFile); // optional
formData.append('_method', 'PUT');

await axios.post('/admin/sponsors/1', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

**Direct cURL:**
```bash
curl -X PUT "https://suaranetizen.co.id/api/admin/sponsors/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "title=Updated Sponsor Name" \
  -F "image=@/path/to/new-image.jpg"
```

### ✅ **5. Delete Sponsor (DELETE /admin/sponsors/{id})**
```bash
curl -X DELETE "https://suaranetizen.co.id/api/admin/sponsors/1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

**Expected Response:**
```json
{
  "message": "Sponsor deleted successfully"
}
```

## 🔧 **Frontend Testing Steps**

### **Test via Admin Panel UI:**

1. **Login ke Admin Panel:**
   - Navigate to `https://suaranetizen.co.id/admin`
   - Login dengan admin credentials
   - Go to Sponsor menu

2. **Test Create:**
   - Click "Add Sponsor" button
   - Fill title: "Test Sponsor"
   - Upload image file
   - Click "Create"
   - Verify success message appears
   - Check sponsor appears in grid

3. **Test Edit:**
   - Click edit button (pencil icon) on existing sponsor
   - Modal should open with current data
   - Modify title to "Updated Test Sponsor"
   - Optionally change image
   - Click "Update"
   - Verify success message appears
   - Check changes reflected in grid

4. **Test Delete:**
   - Click delete button (trash icon) on sponsor
   - Confirm deletion in popup
   - Verify success message appears
   - Check sponsor removed from grid

5. **Test Image Display:**
   - Verify all sponsor images load correctly
   - Check URLs format: `https://suaranetizen.co.id/api/uploads/sponsors/filename.jpg`
   - Test error handling for broken images

## 🚨 **Common Issues & Solutions**

### **Issue 1: 404 Error on Update/Delete**
```bash
# Check routes are properly registered
php artisan route:list | grep sponsor
```

**Solution:** Ensure `Route::apiResource('sponsors', AdminSponsorController::class);` exists in api.php

### **Issue 2: Image Upload Fails**
```bash
# Check upload directory exists and writable
ls -la public_html/api/uploads/sponsors/
chmod 775 public_html/api/uploads/sponsors/
```

### **Issue 3: Images Not Loading**
- Check URL structure: `/api/uploads/sponsors/` not `/uploads/`
- Verify image_url accessor in Sponsor model
- Test direct file access: `https://suaranetizen.co.id/api/uploads/sponsors/filename.jpg`

### **Issue 4: CORS Errors**
```php
// In config/cors.php ensure:
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['*'],
```

### **Issue 5: Permission Errors**
```bash
# Fix permissions for shared hosting
chmod -R 775 public_html/api/uploads/
chmod -R 775 laravel_app/storage/
```

## 📊 **Success Indicators**

✅ **All CRUD operations work without errors**  
✅ **Images upload and display correctly**  
✅ **Success/error messages show appropriately**  
✅ **Modal opens/closes properly**  
✅ **Data refreshes after operations**  
✅ **File cleanup works on delete/update**  

## 🎯 **Performance Testing**

1. **Upload large image (near 2MB limit)**
2. **Test with special characters in title**
3. **Test rapid create/delete operations**
4. **Test concurrent admin users**

---

**🚀 Jika semua test passes, maka Sponsor CRUD sudah fully functional!**
