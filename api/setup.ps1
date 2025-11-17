# Set up and run the Neural Predictive Calculator API

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Neural Predictive Calculator - Setup Script" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Check if we're in the api directory
if (-not (Test-Path "app.py")) {
    Write-Host "Error: Please run this script from the api directory" -ForegroundColor Red
    Write-Host "Usage: cd api; .\setup.ps1" -ForegroundColor Yellow
    exit 1
}

# Step 1: Check Python version
Write-Host "[1/5] Checking Python version..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.9-3.11 from https://www.python.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "      $pythonVersion" -ForegroundColor Green

# Step 2: Create virtual environment
Write-Host "`n[2/5] Creating virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "      Virtual environment already exists" -ForegroundColor Green
} else {
    python -m venv venv
    Write-Host "      Virtual environment created" -ForegroundColor Green
}

# Step 3: Activate virtual environment and install dependencies
Write-Host "`n[3/5] Installing Python dependencies..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1
pip install -q -r requirements.txt
if ($LASTEXITCODE -eq 0) {
    Write-Host "      Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "      Warning: Some dependencies may have failed to install" -ForegroundColor Yellow
}

# Step 4: Check for model weights
Write-Host "`n[4/5] Checking for model weights..." -ForegroundColor Yellow
if (Test-Path "FNN2_weights.weights.h5") {
    $fileSize = (Get-Item "FNN2_weights.weights.h5").Length / 1MB
    Write-Host "      Model weights found ($([math]::Round($fileSize, 2)) MB)" -ForegroundColor Green
} else {
    Write-Host "      Model weights NOT found!" -ForegroundColor Red
    Write-Host "`n      Please download FNN2_weights.weights.h5 from:" -ForegroundColor Yellow
    Write-Host "      https://github.com/AntonStantan/matura/tree/main/FNN" -ForegroundColor Cyan
    Write-Host "`n      Place the file in the api/ directory" -ForegroundColor Yellow
    Write-Host "`n      Or run:" -ForegroundColor Yellow
    Write-Host "      git clone https://github.com/AntonStantan/matura.git temp_repo" -ForegroundColor Cyan
    Write-Host "      copy temp_repo\FNN\FNN2_weights.weights.h5 .\FNN2_weights.weights.h5" -ForegroundColor Cyan
    Write-Host "      rm -r -force temp_repo`n" -ForegroundColor Cyan
}

# Step 5: Ready to start
Write-Host "`n[5/5] Setup complete!" -ForegroundColor Green
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "To start the API server, run:" -ForegroundColor White
Write-Host "  python app.py" -ForegroundColor Cyan
Write-Host "`nThe server will start on http://localhost:5000" -ForegroundColor White
Write-Host "================================================`n" -ForegroundColor Cyan
