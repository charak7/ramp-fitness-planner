#!/bin/bash

# Google Cloud Platform Deployment Script for Ramp Fitness Planner

set -e  # Exit immediately if a command exits with a non-zero status

# Configuration variables
PROJECT_ID=""
SERVICE_NAME="ramp-fitness-planner"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Ramp Fitness Planner - Google Cloud Platform Deployment${NC}"
echo "============================================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud is not installed. Please install Google Cloud SDK first."
    print_error "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if logged in to Google Cloud
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
    print_error "Not logged in to Google Cloud. Please run 'gcloud auth login' first."
    exit 1
fi

# Get project ID
echo
read -p "Enter your Google Cloud Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    print_error "Project ID is required."
    exit 1
fi

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
print_status "Enabling required APIs..."
gcloud services enable run.googleapis.com --project=$PROJECT_ID
gcloud services enable containerregistry.googleapis.com --project=$PROJECT_ID

# Check if OPENROUTER_API_KEY is set
if [ -z "$OPENROUTER_API_KEY" ]; then
    print_warning "OPENROUTER_API_KEY environment variable is not set."
    read -s -p "Enter your OpenRouter API key: " OPENROUTER_API_KEY
    echo
    if [ -z "$OPENROUTER_API_KEY" ]; then
        print_error "OpenRouter API key is required."
        exit 1
    fi
fi

# Build the client
print_status "Building React client..."
cd client
npm install
npm run build
cd ..

# Build and deploy using Cloud Run
print_status "Building and deploying to Google Cloud Run..."

gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --set-env-vars "OPENROUTER_API_KEY=$OPENROUTER_API_KEY,NODE_ENV=production" \
  --port 5000

if [ $? -eq 0 ]; then
    print_status "Deployment successful!"
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --project $PROJECT_ID --format 'value(status.url)')
    echo
    print_status "Your application is now available at: $SERVICE_URL"
    print_status "Health check: $SERVICE_URL/api/health"
    echo
    print_status "To view logs, run: gcloud run services logs read $SERVICE_NAME --region $REGION --project $PROJECT_ID"
else
    print_error "Deployment failed!"
    exit 1
fi