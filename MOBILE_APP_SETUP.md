# M Nas Online Mart - Mobile App Setup Guide

## App Configuration

**App Name:** M Nas Online Mart  
**App ID:** app.lovable.ceb0378e1e4741399ad926a656b7239b

## Prerequisites

Before you begin, make sure you have:
- Node.js and npm installed
- Git installed on your computer
- For iOS: macOS with Xcode installed
- For Android: Android Studio installed

## Step 1: Export and Clone Your Project

1. Click the "Export to Github" button in Lovable
2. Create a new GitHub repository
3. Clone your repository to your local machine:
```bash
git clone <your-github-repo-url>
cd <your-project-folder>
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Add Mobile Platform

Choose the platform you want to build for:

### For Android:
```bash
npx cap add android
npx cap update android
```

### For iOS (macOS only):
```bash
npx cap add ios
npx cap update ios
```

## Step 4: Build Your App

```bash
npm run build
npx cap sync
```

## Step 5: Customize App Icon and Splash Screen

1. **App Icon:** Place your logo image at `public/icon.png` (1024x1024 px recommended)
2. **Splash Screen:** Place your splash image at `public/splash.png` (2732x2732 px recommended)

Then run:
```bash
npx @capacitor/assets generate
```

## Step 6: Run on Device/Emulator

### Android:
```bash
npx cap run android
```

This will:
- Open Android Studio
- Let you select a device/emulator
- Build and run the app

### iOS:
```bash
npx cap run ios
```

This will:
- Open Xcode
- Let you select a device/simulator
- Build and run the app

## Step 7: Making Changes

After making code changes:

1. Pull latest changes from GitHub
```bash
git pull origin main
```

2. Sync with mobile platforms
```bash
npx cap sync
```

## Publishing Your App

### Google Play Store (Android):

1. Build release version:
```bash
cd android
./gradlew bundleRelease
```

2. Sign your app bundle (follow Android documentation)
3. Upload to Google Play Console

### Apple App Store (iOS):

1. Open project in Xcode:
```bash
npx cap open ios
```

2. Configure signing & capabilities
3. Archive and upload to App Store Connect

## Product Management

To update products (names, images, prices):

1. Edit `src/data/products.ts` in your code editor
2. Update the product objects with new information
3. Commit and push changes to GitHub
4. In Lovable, pull the latest changes
5. Or locally: `npm run build && npx cap sync`

## Security Features Enabled

✅ Row Level Security (RLS) policies on all database tables  
✅ Secure authentication with Supabase  
✅ HTTPS-only communication  
✅ Input validation on all forms  
✅ Protected admin routes  
✅ Secure payment processing  
✅ CORS configuration for edge functions  

## Support

For issues or questions:
- Check the [Capacitor Documentation](https://capacitorjs.com/docs)
- Visit the [Lovable Discord](https://discord.gg/lovable)
- Read the [Supabase Documentation](https://supabase.com/docs)

## Important Notes

- **Hot Reload:** The app is configured to hot-reload from the Lovable sandbox during development
- **Production:** Before publishing, update `capacitor.config.ts` to remove the server URL
- **Permissions:** Update `AndroidManifest.xml` and `Info.plist` with required permissions
- **App Store Assets:** Prepare screenshots, descriptions, and promotional materials

---

**Current Version:** 1.0.0  
**Last Updated:** 2025-10-12
