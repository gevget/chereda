$ErrorActionPreference = 'Stop'
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $projectDir

$nextCli = Join-Path $projectDir 'node_modules\next\dist\bin\next'
if (-not (Get-Command node.exe -ErrorAction SilentlyContinue) -or -not (Test-Path -LiteralPath $nextCli)) {
  Write-Host 'Не найден Node.js или зависимости проекта.' -ForegroundColor Red
  Write-Host 'Установите Node.js LTS и выполните pnpm install в папке Chereda.'
  exit 1
}

function Test-Chereda([int]$Port) {
  try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/events/" -TimeoutSec 2 -UseBasicParsing
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

$port = $null
$alreadyRunning = $false
foreach ($candidate in 3000..3010) {
  if (Test-Chereda -Port $candidate) {
    $port = $candidate
    $alreadyRunning = $true
    break
  }

  $listener = $null
  try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $candidate)
    $listener.Start()
    $port = $candidate
    break
  } catch {
    # Another application owns this port; try the next local port.
  } finally {
    if ($listener) { $listener.Stop() }
  }
}

if ($null -eq $port) {
  Write-Host 'Не удалось найти свободный локальный порт 3000–3010.' -ForegroundColor Red
  exit 1
}

if (-not $alreadyRunning) {
  Write-Host "Запускаю Chereda на http://127.0.0.1:$port/events/ ..." -ForegroundColor Cyan
  try {
    Start-Process -FilePath 'node.exe' `
      -ArgumentList "node_modules/next/dist/bin/next dev --webpack --hostname 127.0.0.1 -p $port" `
      -WorkingDirectory $projectDir `
      -WindowStyle Normal | Out-Null
  } catch {
    Write-Host "Не удалось запустить Node.js: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
  }
}

$ready = $false
for ($attempt = 0; $attempt -lt 120; $attempt++) {
  if (Test-Chereda -Port $port) {
    $ready = $true
    break
  }
  Start-Sleep -Milliseconds 750
}

if (-not $ready) {
  Write-Host "Сервер не ответил за 90 секунд. Проверьте окно сервера и повторите запуск." -ForegroundColor Red
  exit 1
}

$url = "http://127.0.0.1:$port/events/"
Write-Host "Chereda запущена: $url" -ForegroundColor Green
Start-Process $url
