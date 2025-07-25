@echo off
echo ========================================
echo MAKING faxascode@gmail.com ADMIN
echo ========================================
echo.

REM First check if service account key exists
if not exist "service-account-key.json" (
    echo ERROR: service-account-key.json not found!
    echo.
    echo Please copy your Firebase service account key:
    echo FROM: C:\Users\MrFax\Documents\faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json
    echo TO: %cd%\service-account-key.json
    echo.
    echo You can do this by running:
    echo copy "C:\Users\MrFax\Documents\faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json" "service-account-key.json"
    echo.
    pause
    exit /b 1
)

echo Running admin setup...
node make-faxas-admin.js

echo.
echo Done! Press any key to exit...
pause