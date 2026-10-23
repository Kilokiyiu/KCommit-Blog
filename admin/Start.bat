@echo off
chcp 65001 >nul
cd /d "%~dp0.."

echo.
echo  KCommit Admin  http://127.0.0.1:4322
echo  关掉本窗口即停止管理端。
echo.

start "" "http://127.0.0.1:4322"
node admin/server.mjs
if errorlevel 1 pause
