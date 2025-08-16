# Azure Deployment Guide for Ramp Fitness Planner

This guide will walk you through deploying your fitness planner application to Microsoft Azure.

## Prerequisites

1. **Azure Account**: You need an active Azure subscription
2. **GitHub Account**: For automated deployments (optional but recommended)
3. **Azure CLI**: Install from [https://docs.microsoft.com/en-us/cli/azure/install-azure-cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

## Option 1: Azure App Service Deployment (Recommended)

### Step 1: Prepare Your Application

1. **Update the web.config file** (already created)
2. **Set up environment variables**:
   - Create a `.env` file in your project root
   - Add your OpenRouter API key: `OPENROUTER_API_KEY=your_api_key_here`

### Step 2: Create Azure App Service

#### Using Azure Portal:

1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Web App"
4. Click "Create"
5. Fill in the details:
   - **Resource Group**: Create new or use existing
   - **Name**: `ramp-fitness-planner` (or your preferred name)
   - **Publish**: Code
   - **Runtime stack**: Node 18 LTS
   - **Operating System**: Linux (recommended) or Windows
   - **Region**: Choose closest to your users
   - **App Service Plan**: Create new (Basic B1 or higher recommended)
6. Click "Review + create" then "Create"

#### Using Azure CLI:

```bash
# Login to Azure
az login

# Create resource group
az group create --name ramp-fitness-rg --location eastus

# Create App Service plan
az appservice plan create --name ramp-fitness-plan --resource-group ramp-fitness-rg --sku B1 --is-linux

# Create web app
az webapp create --name ramp-fitness-planner --resource-group ramp-fitness-rg --plan ramp-fitness-plan --runtime "NODE|18-lts"
```

### Step 3: Configure Environment Variables

1. In Azure Portal, go to your App Service
2. Navigate to **Settings** > **Configuration**
3. Add these Application settings:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `NODE_ENV`: `production`
   - `PORT`: `8080` (Azure App Service uses port 8080)

### Step 4: Deploy Your Application

#### Method A: Using Azure CLI

```bash
# Navigate to your project directory
cd /path/to/your/ramp-project

# Deploy using Azure CLI
az webapp deployment source config-local-git --name ramp-fitness-planner --resource-group ramp-fitness-rg

# Get the deployment URL
az webapp deployment list-publishing-credentials --name ramp-fitness-planner --resource-group ramp-fitness-rg

# Deploy your code
git add .
git commit -m "Deploy to Azure"
git push azure main
```

#### Method B: Using GitHub Actions (Recommended)

1. **Push your code to GitHub**
2. **Set up GitHub Secrets**:
   - Go to your GitHub repository
   - Navigate to **Settings** > **Secrets and variables** > **Actions**
   - Add secret: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Get the publish profile from Azure Portal:
     - Go to your App Service
     - Click **Get publish profile**
     - Copy the content and paste it as the secret value

3. **Update the workflow file**:
   - Edit `azure-deploy.yml`
   - Change `AZURE_WEBAPP_NAME` to your actual app name

4. **Push to trigger deployment**:
   ```bash
   git add .
   git commit -m "Add Azure deployment workflow"
   git push origin main
   ```

### Step 5: Test Your Deployment

1. Visit your app URL: `https://your-app-name.azurewebsites.net`
2. Test the fitness planner functionality
3. Check the API endpoints: `https://your-app-name.azurewebsites.net/api/health`

## Option 2: Container Deployment (Advanced)

### Using Azure Container Instances:

```bash
# Build and push to Azure Container Registry
az acr build --registry your-registry-name --image ramp-fitness:latest .

# Deploy to Container Instances
az container create \
  --resource-group ramp-fitness-rg \
  --name ramp-fitness-container \
  --image your-registry-name.azurecr.io/ramp-fitness:latest \
  --dns-name-label ramp-fitness \
  --ports 5000 \
  --environment-variables OPENROUTER_API_KEY=your_api_key
```

### Using Azure Container Apps:

1. Create Container App in Azure Portal
2. Use the Dockerfile provided
3. Set environment variables
4. Deploy

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Verify build scripts work locally

2. **API Key Issues**:
   - Verify environment variables are set correctly
   - Check API key permissions and quotas

3. **Routing Issues**:
   - Ensure web.config is in the root directory
   - Check that React build files are generated

4. **Performance Issues**:
   - Consider upgrading to a higher App Service plan
   - Implement caching strategies
   - Optimize React bundle size

### Monitoring and Logs:

1. **Application Logs**:
   - In Azure Portal, go to your App Service
   - Navigate to **Monitoring** > **Log stream**
   - Check for errors and warnings

2. **Performance Monitoring**:
   - Use Azure Application Insights
   - Monitor response times and error rates

## Security Considerations

1. **Environment Variables**: Never commit API keys to version control
2. **HTTPS**: Azure App Service provides HTTPS by default
3. **Rate Limiting**: Your app already has rate limiting implemented
4. **CORS**: Configure CORS settings if needed for production

## Cost Optimization

1. **App Service Plans**:
   - Start with Basic B1 plan (~$13/month)
   - Scale up as needed
   - Consider using Consumption plan for low traffic

2. **Container Options**:
   - Container Instances: Pay per second
   - Container Apps: Serverless pricing

## Next Steps

1. **Custom Domain**: Set up a custom domain name
2. **SSL Certificate**: Configure SSL (included with App Service)
3. **CDN**: Add Azure CDN for better performance
4. **Monitoring**: Set up Application Insights
5. **Backup**: Configure automated backups

## Support

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Container Instances Documentation](https://docs.microsoft.com/en-us/azure/container-instances/)
- [Azure CLI Documentation](https://docs.microsoft.com/en-us/cli/azure/)
