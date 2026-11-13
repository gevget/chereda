@echo off
setlocal
cd /d "%~dp0"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Запустить Chereda.ps1"
if errorlevel 1 (
  echo.
  echo Chereda could not be started. See the message above.
  pause
)

endlocal
