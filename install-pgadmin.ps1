# PowerShell script to install pgAdmin4
Write-Host "Installing pgAdmin4..." -ForegroundColor Green

# Download pgAdmin4
$pgadminUrl = "https://ftp.postgresql.org/pub/pgadmin/pgadmin4/v9.13.0/windows/pgadmin4-9.13.0-x64.exe"
$installerPath = "$env:TEMP\pgadmin4-installer.exe"

Write-Host "Downloading pgAdmin4 from: $pgadminUrl"
Invoke-WebRequest -Uri $pgadminUrl -OutFile $installerPath

Write-Host "Starting pgAdmin4 installation..."
Start-Process -FilePath $installerPath -ArgumentList "/S" -Wait -NoNewWindow

Write-Host "pgAdmin4 installation completed!" -ForegroundColor Green
Write-Host "You can now launch pgAdmin4 from Start Menu" -ForegroundColor Yellow

# Cleanup
Remove-Item $installerPath -ErrorAction SilentlyContinue
