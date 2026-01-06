# Google Cloud Platform Deployment Guide for Ramp Fitness Planner

This guide will walk you through deploying your fitness planner application to Google Cloud Platform (GCP).

## Prerequisites

1. **Google Cloud Account**: You need an active Google Cloud account
2. **Google Cloud CLI**: Install from [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
3. **Docker**: Install Docker if you plan to deploy using Cloud Run (recommended)

## Option 1: Google Cloud Run Deployment (Recommended)

Cloud Run is Google's serverless platform that automatically scales your containerized application.

### Step 1: Prepare Your Application

1. **Set up environment variables**:
   - Create a `.env` file in your project root
   - Add your OpenRouter API key: `OPENROUTER_API_KEY=your_api_key_here`

2. **Ensure Dockerfile is ready** (already provided in your project)

### Step 2: Authenticate with Google Cloud

```bash
# Login to Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID
```

### Step 3: Enable Required APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 4: Build and Deploy with Cloud Run

#### Method A: Using gcloud CLI (Recommended)

```bash
# Build and deploy in one command
gcloud run deploy ramp-fitness-planner \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENROUTER_API_KEY=your_api_key_here,NODE_ENV=production
```

#### Method B: Using pre-built container

```bash
# Build the container locally
docker build -t gcr.io/YOUR_PROJECT_ID/ramp-fitness-planner .

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/ramp-fitness-planner

# Deploy to Cloud Run
gcloud run deploy ramp-fitness-planner \
  --image gcr.io/YOUR_PROJECT_ID/ramp-fitness-planner \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENROUTER_API_KEY=your_api_key_here,NODE_ENV=production
```

### Step 5: Configure Environment Variables (Alternative Method)

If you prefer to store secrets securely:

```bash
# Create a secret
gcloud secrets create openrouter-api-key --data-file=<(echo -n "your_api_key_here")

# Deploy with secret mounting
gcloud run deploy ramp-fitness-planner \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --set-secrets OPENROUTER_API_KEY=openrouter-api-key:latest
```

## Option 2: Google App Engine Deployment

App Engine is Google's traditional Platform-as-a-Service offering.

### Step 1: Prepare Your Application

1. **Set up environment variables**:
   - Update the `app.yaml` file with your OpenRouter API key
   - Replace `YOUR_OPENROUTER_API_KEY_HERE` with your actual API key

2. **Build the application**:
   ```bash
   # Install dependencies and build the client
   npm run build
   ```

### Step 2: Deploy to App Engine

#### Method A: Using gcloud CLI

```bash
# Deploy to App Engine
gcloud app deploy
```

#### Method B: Using package.json script

```bash
npm run gcp-appengine-deploy
```

### Step 3: Configure Environment Variables

You can also set environment variables after deployment:

```bash
# Set environment variables
gcloud app deploy --quiet
```

Or use Google Secret Manager for more secure handling of secrets:

```bash
# Create a secret
gcloud secrets create openrouter-api-key --data-file=<(echo -n "your_api_key_here")

# Update your app.yaml to use the secret (requires custom runtime, see advanced deployment)
```

## Option 3: Google Kubernetes Engine (GKE)

For more advanced deployments with full control.

### Step 1: Create Kubernetes Manifest

Create a `k8s-deployment.yaml` file:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ramp-fitness-planner
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ramp-fitness-planner
  template:
    metadata:
      labels:
        app: ramp-fitness-planner
    spec:
      containers:
      - name: ramp-fitness-planner
        image: gcr.io/YOUR_PROJECT_ID/ramp-fitness-planner
        ports:
        - containerPort: 5000
        env:
        - name: OPENROUTER_API_KEY
          valueFrom:
            secretKeyRef:
              name: fitness-app-secrets
              key: openrouter-api-key
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "5000"
---
apiVersion: v1
kind: Service
metadata:
  name: ramp-fitness-planner-service
spec:
  selector:
    app: ramp-fitness-planner
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
  type: LoadBalancer
```

### Step 2: Deploy to GKE

```bash
# Create cluster (if needed)
gcloud container clusters create ramp-cluster --zone us-central1-a

# Get credentials
gcloud container clusters get-credentials ramp-cluster --zone us-central1-a

# Create secret
kubectl create secret generic fitness-app-secrets --from-literal=openrouter-api-key=your_api_key_here

# Apply deployment
kubectl apply -f k8s-deployment.yaml
```

## Option 4: Compute Engine

For full control over the virtual machine.

### Step 1: Create a VM Instance

```bash
# Create instance
gcloud compute instances create ramp-fitness-vm \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=20GB
```

### Step 2: SSH and Install Dependencies

```bash
# SSH into the instance
gcloud compute ssh ramp-fitness-vm --zone=us-central1-a

# Install Node.js, npm, and other dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y docker.io

# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY

# Set environment variables
export OPENROUTER_API_KEY=your_api_key_here
export NODE_ENV=production

# Install dependencies and start the app
npm install
cd client && npm run build && cd ..
npm start
```

## Environment Variables Setup

For any of the above options, you'll need to set these environment variables:

- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `NODE_ENV`: Set to `production` for production deployments
- `PORT`: Set to `8080` or `5000` depending on your setup

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility (should be 18.x)
   - Ensure all dependencies are in package.json
   - Verify build scripts work locally

2. **API Key Issues**:
   - Verify environment variables are set correctly
   - Check API key permissions and quotas

3. **Container Issues**:
   - Ensure the Dockerfile exposes the correct port (5000)
   - Verify the CMD instruction starts the correct service

4. **CORS Issues**:
   - The application already has CORS enabled in server/index.js
   - If deploying frontend separately, ensure CORS configuration matches

### Monitoring and Logs:

1. **Cloud Run Logs**:
   - Use Cloud Console or run: `gcloud run services logs read ramp-fitness-planner --platform managed --region us-central1`

2. **App Engine Logs**:
   - Use Cloud Console or run: `gcloud app logs tail -s default`

## Security Considerations

1. **Environment Variables**: Never commit API keys to version control
2. **HTTPS**: Google Cloud services provide HTTPS by default
3. **Rate Limiting**: Your app already has rate limiting implemented
4. **Secrets Management**: Use Google Secret Manager for sensitive data

## Cost Optimization

1. **Cloud Run**: Pay only for requests, ideal for variable traffic
2. **App Engine**: Automatic scaling with minimum instances option
3. **GKE**: More expensive but provides full control
4. **Compute Engine**: Fixed cost based on VM size

## Next Steps

1. **Custom Domain**: Set up a custom domain name in Google Cloud Console
2. **SSL Certificate**: Configure SSL (included with most GCP services)
3. **Cloud CDN**: Add Cloud CDN for better performance
4. **Cloud Monitoring**: Set up monitoring and alerting
5. **Backup**: Configure automated backups if needed

## Option 5: GitHub Actions Deployment

You can set up automated deployments to Google Cloud using GitHub Actions.

### Step 1: Create Google Cloud Service Account

1. Create a service account in Google Cloud Console
2. Download the JSON key file
3. Grant the following roles to the service account:
   - `roles/run.admin`
   - `roles/iam.serviceAccountUser`
   - `roles/storage.admin` (for Cloud Build)
   - `roles/cloudbuild.builds.editor` (if using Cloud Build)

### Step 2: Add Secrets to GitHub Repository

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Add the following secrets:
   - `GCP_CREDENTIALS`: The content of your service account JSON key file
   - `OPENROUTER_API_KEY`: Your OpenRouter API key

### Step 3: Configure Workflow

The project includes pre-configured GitHub Actions workflows in `.github/workflows/`:

- `gcp-cloud-run-deploy.yml`: Deploy directly to Cloud Run
- `gcp-app-engine-deploy.yml`: Deploy to App Engine
- `gcp-cloud-build-deploy.yml`: Build with Cloud Build and deploy to Cloud Run

### Step 4: Update Workflow Configuration

Update the `PROJECT_ID` in the workflow files with your actual Google Cloud Project ID.

### Step 5: Trigger Deployment

Push your code to the `main` or `master` branch to trigger the deployment automatically.

## Support

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Google App Engine Documentation](https://cloud.google.com/appengine/docs)
- [Google Kubernetes Engine Documentation](https://cloud.google.com/kubernetes-engine/docs)
- [Google Cloud SDK Documentation](https://cloud.google.com/sdk/docs)
- [GitHub Actions for Google Cloud](https://github.com/marketplace?query=google-cloud+actions)