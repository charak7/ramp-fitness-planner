# RAMP Fitness Planner

A modern, AI-powered fitness planning application built with React, Tailwind CSS, and Node.js/Express. The app generates personalized fitness plans using OpenRouter's AI models.

## Features

- **Clean, Modern UI**: Beautiful React + Tailwind CSS interface
- **Goal Selection**: Choose between Gain Muscle, Lose Fat, or Both
- **Comprehensive Inputs**: Equipment access, schedule, experience level, injuries, preferences, and dietary notes
- **AI-Powered Plans**: OpenRouter integration for personalized fitness recommendations
- **Structured Output**: JSON-first response with human-readable fallback
- **Plan Display**: Organized tabs for overview, weekly schedule, nutrition, and progression
- **Download Plans**: Export your fitness plan as JSON
- **Form Validation**: Client-side validation with error handling
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **OpenRouter API** integration (OpenAI-compatible)
- **Rate limiting** and **CORS** support
- **Input validation** middleware

### Frontend
- **React 18** with functional components and hooks
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication

## Prerequisites

- Node.js 16+ 
- npm or yarn
- OpenRouter API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ramp-fitness-planner
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your OpenRouter API key
   OPENROUTER_API_KEY=your_actual_api_key_here
   ```

## Configuration

### OpenRouter API Setup

1. Get your API key from [OpenRouter](https://openrouter.ai/)
2. Add it to your `.env` file:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```

### Environment Variables

- `OPENROUTER_API_KEY`: Your OpenRouter API key (required)
- `OPENROUTER_API_URL`: OpenRouter API endpoint (defaults to production)
- `PORT`: Server port (defaults to 5000)

## Running the Application

### Development Mode
```bash
# Run both frontend and backend concurrently
npm run dev
```

### Production Mode
```bash
# Build the frontend
npm run build

# Start the server
npm run server
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## API Endpoints

### POST /api/generate-plan
Generates a personalized fitness plan based on user inputs.

**Request Body:**
```json
{
  "goal": "Gain Muscle",
  "equipmentAccess": "Basic",
  "daysPerWeek": 4,
  "sessionLength": 60,
  "experience": "Intermediate",
  "injuries": "None",
  "preferences": "Prefer compound movements",
  "dietaryNotes": "Vegetarian"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "plan": {
      "goal": "Gain Muscle",
      "summary": "Comprehensive muscle building plan...",
      "weeklySchedule": [...],
      "nutritionGuidelines": {...},
      "progression": "...",
      "safetyNotes": "...",
      "estimatedResults": "..."
    }
  },
  "rawResponse": "AI response content..."
}
```

## Project Structure

```
ramp-fitness-planner/
├── server/
│   └── index.js              # Express server with OpenRouter integration
├── client/
│   ├── public/
│   │   └── index.html        # Main HTML file
│   ├── src/
│   │   ├── components/
│   │   │   ├── FitnessPlannerForm.js    # Main form component
│   │   │   └── PlanDisplay.js           # Plan display component
│   │   ├── App.js            # Main app component
│   │   ├── App.css           # App-specific styles
│   │   ├── index.js          # React entry point
│   │   └── index.css         # Global styles with Tailwind
│   ├── package.json          # Client dependencies
│   ├── tailwind.config.js    # Tailwind configuration
│   └── postcss.config.js     # PostCSS configuration
├── package.json              # Root package.json
├── env.example               # Environment variables template
└── README.md                 # This file
```

## Features in Detail

### Form Validation
- Required goal selection
- Numeric validation for days per week (1-7)
- Session length validation (15-180 minutes)
- Real-time error clearing

### AI Integration
- Structured prompts for consistent output
- JSON-first response format
- Human-readable fallback
- Error handling for API failures

### User Experience
- Loading states and progress indicators
- Responsive design for all devices
- Smooth animations and transitions
- Intuitive tabbed plan display

## Customization

### Styling
- Modify `client/tailwind.config.js` for theme changes
- Update `client/src/index.css` for custom component styles
- Use Tailwind utility classes for rapid styling

### AI Prompts
- Edit the prompt template in `server/index.js`
- Adjust the expected JSON structure
- Modify temperature and token limits

### Form Fields
- Add new input fields in `FitnessPlannerForm.js`
- Update validation logic
- Modify the API request structure

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Ensure your OpenRouter API key is correct
   - Check that the `.env` file is in the root directory

2. **Port Conflicts**
   - Change the PORT in `.env` if 5000 is occupied
   - Update the proxy in `client/package.json` accordingly

3. **Build Errors**
   - Clear `node_modules` and reinstall dependencies
   - Ensure Node.js version is 16+

4. **CORS Issues**
   - Verify the server is running on the correct port
   - Check that the client proxy is configured correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Deployment Options

### Google Cloud Platform

The application can be deployed to Google Cloud Platform using several methods:

#### Option 1: Google Cloud Run (Recommended)

1. Install Google Cloud SDK: [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
2. Authenticate with your Google Cloud account:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```
3. Enable required APIs:
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```
4. Deploy using the provided script or manually:
   ```bash
   gcloud run deploy ramp-fitness-planner \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars OPENROUTER_API_KEY=your_api_key_here,NODE_ENV=production
   ```

#### Option 2: Google App Engine

1. Update the `app.yaml` file with your API key
2. Run the deployment command:
   ```bash
   gcloud app deploy
   ```

#### Option 3: GitHub Actions Deployment

1. Set up your Google Cloud service account and download the JSON key file
2. Add the following secrets to your GitHub repository:
   - `GCP_CREDENTIALS`: The content of your service account JSON key file
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
3. Push your code to GitHub - the deployment will happen automatically

For detailed deployment instructions, see the [GCP Deployment Guide](gcp-deployment-guide.md).

### Azure (Original)

The application was originally configured for Azure deployment. For Azure deployment instructions, see the [Azure Deployment Guide](azure-deployment-guide.md).

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Open an issue on GitHub

---

**Note**: This application requires a valid OpenRouter API key to function. The AI-generated plans are for informational purposes and should not replace professional medical or fitness advice.










