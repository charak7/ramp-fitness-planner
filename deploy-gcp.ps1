# PowerShell Deployment Script for Google Cloud Platform
# Ramp Fitness Planner

# Set error handling
$ErrorActionPreference = "Stop"

# Configuration variables
$serviceName = "ramp-fitness-planner"
$region = "us-central1"
$projectID = ""

# Colors for output
$green = "`e[32m"
$yellow = "`e[33m"
$red = "`e[31m"
$reset = "`e[0m"

Write-Host "${green}Ramp Fitness Planner - Google Cloud Platform Deployment${reset}" -ForegroundColor Green
Write-Host "============================================================="

# Function to print status
function Write-Status {
    param([string]$message)
    Write-Host "[INFO] $message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$message)
    Write-Host "[WARNING] $message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$message)
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

# Check if gcloud is installed
try {
    gcloud version | Out-Null
} catch {
    Write-Error "gcloud is not installed. Please install Google Cloud SDK first."
    Write-Error "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
}

# Check if logged in to Google Cloud
$activeAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (-not $activeAccount) {
    Write-Error "Not logged in to Google Cloud. Please run 'gcloud auth login' first."
    exit 1
}

# Get project ID
Write-Host ""
$projectID = Read-Host "Enter your Google Cloud Project ID"

if (-not $projectID) {
    Write-Error "Project ID is required."
    exit 1
}

# Set the project
gcloud config set project $projectID

# Enable required APIs
Write-Status "Enabling required APIs..."
gcloud services enable run.googleapis.com --project=$projectID
gcloud services enable containerregistry.googleapis.com --project=$projectID

# Check if OPENROUTER_API_KEY is set
if (-not $env:OPENROUTER_API_KEY) {
    Write-Warning "OPENROUTER_API_KEY environment variable is not set."
    $openRouterApiKey = Read-Host "Enter your OpenRouter API key (input will be hidden)" -AsSecureString
    $openRouterApiKey = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($openRouterApiKey))
    
    if (-not $openRouterApiKey) {
        Write-Error "OpenRouter API key is required."
        exit 1
    }
} else {
    $openRouterApiKey = $env:OPENROUTER_API_KEY
}

# Build the client
Write-Status "Building React client..."
Set-Location client
npm install
npm run build
Set-Location ..

# Build and deploy using Cloud Run
Write-Status "Building and deploying to Google Cloud Run..."

gcloud run deploy $serviceName `
  --source . `
  --platform managed `
  --region $region `
  --project $projectID `
  --allow-unauthenticated `
  --set-env-vars "OPENROUTER_API_KEY=$openRouterApiKey,NODE_ENV=production" `
  --port 5000

if ($LASTEXITCODE -eq 0) {
    Write-Status "Deployment successful!"
    $serviceUrl = $(gcloud run services describe $serviceName --region $region --project $projectID --format 'value(status.url)')
    Write-Host ""
    Write-Status "Your application is now available at: $serviceUrl"
    Write-Status "Health check: $serviceUrl/api/health"
    Write-Host ""
    Write-Status "To view logs, run: gcloud run services logs read $serviceName --region $region --project $projectID"
} else {
    Write-Error "Deployment failed!"
    exit 1
}