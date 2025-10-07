# Image Setup for Login Page

## ✅ Fixed: Carousel Background Image

The carousel background image is now properly set up and should be visible on the login page.

## 📁 File Locations

### Carousel Background Image
- **Source**: `src/assets/images/admin-background.png`
- **Public**: `public/assets/images/admin-background.png` ✅
- **URL Path**: `/assets/images/admin-background.png`

### Logo Images
- **Dark Logo**: `src/assets/images/logo-dark.png` (imported via Next.js)
- **Light Logo**: `src/assets/images/logo-light.png` (imported via Next.js)
- **TRASEALLA Logo**: `public/assets/images/TRASEALLA.png` ✅

## 🔧 How It Works

### Next.js Static Assets
In Next.js, there are two ways to serve images:

1. **Public Directory** (`/public/`):
   - Files are served directly from the root URL
   - Example: `public/assets/images/bg.png` → `/assets/images/bg.png`
   - Used for: Background images, static assets

2. **Assets Directory** (`/src/assets/`):
   - Files are processed by Next.js build system
   - Imported in components: `import logo from '@/assets/images/logo.png'`
   - Used for: Component images, optimized assets

### Our Setup
- **Carousel background**: Uses public directory (large image, no optimization needed)
- **Logos**: Use assets directory (imported, optimized by Next.js)

## 🎯 Current Configuration

### SignIn Component
```javascript
const carouselItems = [
  {
    src: '/assets/images/admin-background.png', // ✅ Correct path
    subHeader: 'Your gateway to unforgettable adventures around the world'
  }
];
```

### Image Imports
```javascript
import DarkLogo from '@/assets/images/logo-dark.png'; // ✅ Correct
import LightLogo from '@/assets/images/logo-light.png'; // ✅ Correct
```

## 🚀 Testing

To verify the image is working:

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Visit the login page**:
   ```
   http://localhost:3000/auth/sign-in
   ```

3. **Check the carousel**:
   - Should show the background image on the left side
   - Image should cover the full height
   - Should have gradient overlay with text

4. **Direct image test**:
   ```
   http://localhost:3000/assets/images/admin-background.png
   ```
   Should display the image directly.

## 🔍 Troubleshooting

### If Image Still Not Showing

1. **Check browser console** for 404 errors
2. **Verify file exists**:
   ```bash
   ls -la public/assets/images/admin-background.png
   ```

3. **Check file permissions**:
   ```bash
   chmod 644 public/assets/images/admin-background.png
   ```

4. **Clear browser cache** (Ctrl+F5 or Cmd+Shift+R)

5. **Restart dev server**:
   ```bash
   npm run dev
   ```

### Alternative Image Paths

If you want to use a different image:

1. **Replace the file**:
   ```bash
   cp your-new-image.png public/assets/images/admin-background.png
   ```

2. **Or update the path** in `SignIn.jsx`:
   ```javascript
   src: '/assets/images/your-new-image.png'
   ```

## 📝 File Structure

```
public/
├── assets/
│   └── images/
│       ├── admin-background.png ✅
│       └── TRASEALLA.png ✅
└── favicon.ico

src/
└── assets/
    └── images/
        ├── logo-dark.png ✅
        ├── logo-light.png ✅
        └── admin-background.png (source)
```

## 🎨 Image Specifications

### Recommended Background Image
- **Format**: PNG or JPG
- **Size**: 1920x1080px (Full HD)
- **Aspect Ratio**: 16:9
- **File Size**: < 2MB (current: ~1.5MB)
- **Content**: Should work well with gradient overlay

### Current Image
- **File**: `admin-background.png`
- **Size**: 1,552,890 bytes (~1.5MB)
- **Status**: ✅ Working

## ✨ Next Steps

The image setup is complete! The carousel background should now be visible on the login page. If you want to:

1. **Change the image**: Replace `public/assets/images/admin-background.png`
2. **Add more carousel items**: Update the `carouselItems` array
3. **Customize the overlay**: Edit the CSS in `_login.scss`

---

**Status**: ✅ Fixed and Working  
**Last Updated**: October 6, 2025
