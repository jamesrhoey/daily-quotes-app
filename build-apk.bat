@echo off
echo Building Daily Quotes & Bible Verse APK...
echo.

echo Step 1: Installing dependencies...
npm install

echo.
echo Step 2: Building for Android...
npx expo export --platform android

echo.
echo Step 3: Creating APK...
npx expo run:android --variant release

echo.
echo Build complete! Check the android/app/build/outputs/apk/release/ folder for your APK file.
pause 