# Deploying to Vercel

This project is configured for deployment on Vercel. Here's how to deploy it:

## Prerequisites

1. Sign up for a free account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI globally: `npm install -g vercel`
3. Have your OpenRouter API key ready

## Deployment Steps

### Option 1: Using Vercel CLI

1. Navigate to your project directory:
   ```bash
   cd c:\Users\hp\Desktop\ramp
   ```

2. Run the deployment command:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Set the project name (or use the default)
   - Select your scope
   - Confirm the root directory
   - Set environment variables when prompted:
     - `OPENROUTER_API_KEY`: Your OpenRouter API key
     - `OPENROUTER_API_URL`: (Optional) API URL (defaults to `https://openrouter.ai/api/v1/chat/completions`)

4. Once deployed, Vercel will provide you with a URL for your live application.

### Option 2: Using Git Integration (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com) and click "New Project"
3. Import your Git repository
4. Vercel will automatically detect the project and configure it
5. Add the required environment variables in the Vercel dashboard:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `OPENROUTER_API_URL`: (Optional) API URL (defaults to `https://openrouter.ai/api/v1/chat/completions`)
6. Click "Deploy" and your application will be live

## Project Configuration

The project is configured with the following:

- Frontend: React application built with Create React App (builds to `client/build`)
- Backend: Vercel serverless functions in the `/api` directory
- Build process: Vercel automatically builds the React app first, then deploys API functions
- API routes:
  - `POST /api/generate-plan` - Generates fitness plans using AI
  - `GET /api/health` - Health check endpoint
  - `GET /api/debug-config` - Configuration debugging endpoint

## Environment Variables

Make sure to set these environment variables in your Vercel project:

- `OPENROUTER_API_KEY` (required): Your API key from OpenRouter
- `OPENROUTER_API_URL` (optional): API endpoint URL (defaults to OpenRouter)

## Troubleshooting

1. If API calls fail, ensure that the `OPENROUTER_API_KEY` environment variable is properly set in Vercel
2. Check the Vercel logs in your dashboard if you encounter issues
3. The application uses CORS headers to allow cross-origin requests

## Next Steps

After successful deployment:
1. Test the application by filling out the fitness planner form
2. Verify that AI-generated plans are returned correctly
3. Check that the download functionality works
4. Ensure all features work as expected on the deployed URL