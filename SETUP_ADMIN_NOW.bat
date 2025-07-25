@echo off
echo ========================================
echo FAXAS ADMIN SETUP
echo ========================================
echo.
echo This will make faxascode@gmail.com an admin
echo.
echo First, let's copy your service account key...
echo.

REM Try to copy from Documents
if exist "C:\Users\MrFax\Documents\faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json" (
    copy "C:\Users\MrFax\Documents\faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json" "service-account-key.json"
    echo ✓ Copied from Documents folder
    goto :run_setup
)

REM Try to copy from current directory if it exists
if exist "faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json" (
    copy "faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json" "service-account-key.json"
    echo ✓ Found key in current directory
    goto :run_setup
)

REM If not found
echo ERROR: Could not find the service account key!
echo.
echo Please copy your Firebase service account key to this folder.
echo The file should be named:
echo   faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json
echo.
echo You said it's in: DOCUMENTS\faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json
echo.
pause
exit /b 1

:run_setup
echo.
echo Running admin setup...
echo.
node setup-admin-with-key.js

echo.
pause