# Script copy code lên EC2
# Sử dụng: .\deploy-to-ec2.ps1 -EC2IP "98.93.62.6"

param(
    [Parameter(Mandatory=$true)]
    [string]$EC2IP,
    
    [string]$KeyFile = "lab04\src\lab044.pem",
    [string]$SourcePath = "lab04\src",
    [string]$RemoteUser = "ec2-user",
    [string]$RemotePath = "~/lab04"
)

$KeyPath = Join-Path $PSScriptRoot $KeyFile
$SourceFullPath = Join-Path $PSScriptRoot $SourcePath

Write-Host "Đang copy code lên EC2..." -ForegroundColor Green
Write-Host "EC2 IP: $EC2IP" -ForegroundColor Yellow
Write-Host "Key file: $KeyPath" -ForegroundColor Yellow

# Copy toàn bộ thư mục src lên EC2
scp -i $KeyPath -r $SourceFullPath ${RemoteUser}@${EC2IP}:${RemotePath}/

Write-Host "Copy thành công!" -ForegroundColor Green
Write-Host "Bây giờ SSH vào EC2 và chạy các lệnh trong file setup-ec2.sh" -ForegroundColor Yellow
