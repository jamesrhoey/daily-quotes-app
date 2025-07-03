@echo off
echo ========================================
echo Building Daily Quotes & Bible Verse APK
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Building standalone APK...
echo This will create an APK file that works without terminal!
echo.

call npx expo export --platform android

echo.
echo Step 3: Creating APK package...
echo.

if exist "dist" (
    echo Build completed successfully!
    echo.
    echo Your APK files are in the 'dist' folder
    echo Copy these files to your Android phone and install them
    echo.
    echo To install on your phone:
    echo 1. Enable "Install from Unknown Sources" in Settings
    echo 2. Copy the APK files to your phone
    echo 3. Tap the APK file to install
    echo.
) else (
    echo Build failed. Please check the error messages above.
)

echo.
echo Press any key to exit...
pause > nul 