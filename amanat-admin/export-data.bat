@echo off
title Amanat Data Exporter
cd /d "%~dp0"
echo ===================================================
echo   EXPORTING PUBLISHED LISTINGS TO PUBLIC SITE
echo ===================================================
echo.

:: Run the export script
call node scripts/export-listings.js

echo.
echo ===================================================
echo   EXPORT COMPLETE
echo ===================================================
echo.
echo   [1] Check 'public/data' folder for updated JSON files.
echo   [2] You can now deploy the main website.
echo.
pause
