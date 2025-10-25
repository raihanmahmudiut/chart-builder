@echo off
echo ========================================
echo Clean Installation Script for Windows
echo ========================================
echo.

echo Step 1: Stopping Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Removing node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo node_modules deleted
) else (
    echo node_modules not found
)

echo Step 3: Removing lock files...
if exist package-lock.json (
    del /f package-lock.json
    echo package-lock.json deleted
)

echo Step 4: Clearing npm cache...
call npm cache clean --force

echo Step 5: Installing dependencies...
call npm install

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
    echo Installation successful!
    echo Run: npm run dev
) else (
    echo Installation failed. See INSTALL-FIX.md for help.
)
echo ========================================
pause

