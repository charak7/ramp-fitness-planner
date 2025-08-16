# RAMP Fitness Planner

A modern, AI-powered fitness planning application built with React, Tailwind CSS, and Node.js/Express. The app generates personalized fitness plans using DeepSeek's AI model.

## Features

- **Clean, Modern UI**: Beautiful React + Tailwind CSS interface
- **Goal Selection**: Choose between Gain Muscle, Lose Fat, or Both
- **Comprehensive Inputs**: Equipment access, schedule, experience level, injuries, preferences, and dietary notes
- **AI-Powered Plans**: DeepSeek integration for personalized fitness recommendations
- **Structured Output**: JSON-first response with human-readable fallback
- **Plan Display**: Organized tabs for overview, weekly schedule, nutrition, and progression
- **Download Plans**: Export your fitness plan as JSON
- **Form Validation**: Client-side validation with error handling
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **DeepSeek API** integration (OpenAI-compatible)
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
- DeepSeek API key

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
   
   # Edit .env with your DeepSeek API key
   DEEPSEEK_API_KEY=your_actual_api_key_here
   ```

## Configuration

### DeepSeek API Setup

1. Get your API key from [DeepSeek](https://platform.deepseek.com/)
2. Add it to your `.env` file:
   ```
   DEEPSEEK_API_KEY=your_api_key_here
   ```

### Environment Variables

- `DEEPSEEK_API_KEY`: Your DeepSeek API key (required)
- `DEEPSEEK_API_URL`: DeepSeek API endpoint (defaults to production)
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
│   └── index.js              # Express server with DeepSeek integration
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
   - Ensure your DeepSeek API key is correct
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

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Open an issue on GitHub

---

**Note**: This application requires a valid DeepSeek API key to function. The AI-generated plans are for informational purposes and should not replace professional medical or fitness advice.







