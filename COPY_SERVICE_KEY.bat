@echo off
echo Copying Firebase Service Account Key...
copy "C:\Users\MrFax\Documents\faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json" "service-account-key.json"
if %errorlevel% == 0 (
    echo SUCCESS! Service account key copied.
    echo.
    echo Now run: node make-faxas-admin.js
) else (
    echo ERROR: Could not find the service account key.
    echo Make sure the file exists at:
    echo C:\Users\MrFax\Documents\faxas-website-firebase-adminsdk-fbsvc-b5a908dc58.json
)
pause