@echo off
title Amanat Admin Server
cd /d "%~dp0"
echo ===================================================
echo   STARTING AMANAT INTERNAL SYSTEM
echo ===================================================
echo.
echo   [1] Server is starting... please wait.
echo   [2] Once 'Execution Time' appears, minimize this window.
echo   [3] Open Chrome/Edge and go to: http://localhost:1337/admin
echo.
echo   DO NOT CLOSE THIS WINDOW while using the system.
echo ===================================================
echo.

call npm run start
pause
