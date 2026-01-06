import axios from 'axios';

// Validation function
const validatePlanRequest = (reqBody) => {
  const { goal, equipmentAccess, daysPerWeek, sessionLength, experience, injuries, preferences, dietaryNotes } = reqBody;
  
  if (!goal || !['Gain Muscle', 'Lose Fat', 'Both'].includes(goal)) {
    return { valid: false, error: 'Valid goal is required (Gain Muscle, Lose Fat, or Both)' };
  }
  
  if (daysPerWeek && (daysPerWeek < 1 || daysPerWeek > 7)) {
    return { valid: false, error: 'Days per week must be between 1 and 7' };
  }
  
  if (sessionLength && (sessionLength < 15 || sessionLength > 180)) {
    return { valid: false, error: 'Session length must be between 15 and 180 minutes' };
  }
  
  return { valid: true };
};

// Function to generate human-readable plan from JSON data
const generateHumanReadablePlan = (jsonData, userInput) => {
  const plan = jsonData.plan || jsonData;
  let response = '';

  // Header with user's goal
  response += `🏋️‍♂️ **YOUR PERSONALIZED FITNESS PLAN** 🏋️‍♂️\n\n`;
  response += `**Goal:** ${userInput.goal}\n`;
  response += `**Experience Level:** ${userInput.experience}\n`;
  response += `**Workout Frequency:** ${userInput.daysPerWeek} days per week\n`;
  response += `**Session Duration:** ${userInput.sessionLength} minutes\n`;
  response += `**Equipment Access:** ${userInput.equipmentAccess}\n\n`;

  // Plan Summary
  if (plan.summary) {
    response += `## 📋 **PLAN OVERVIEW**\n\n`;
    response += `${plan.summary}\n\n`;
  }

  // Weekly Schedule
  if (plan.weeklySchedule && Array.isArray(plan.weeklySchedule)) {
    response += `## 📅 **WEEKLY WORKOUT SCHEDULE**\n\n`;
    
    plan.weeklySchedule.forEach((day, index) => {
      response += `### **${day.day}**\n`;
      response += `**Focus:** ${day.focus || 'General Fitness'}\n`;
      response += `**Duration:** ${day.duration || userInput.sessionLength + ' minutes'}\n`;
      if (day.intensity) response += `**Intensity:** ${day.intensity}\n`;
      response += `\n`;

      if (day.exercises && Array.isArray(day.exercises)) {
        response += `**Exercises:**\n`;
        day.exercises.forEach((exercise, exIndex) => {
          response += `${exIndex + 1}. **${exercise.name}**\n`;
          response += `   • Sets: ${exercise.sets || '3'}\n`;
          response += `   • Reps: ${exercise.reps || '10-12'}\n`;
          if (exercise.rest) response += `   • Rest: ${exercise.rest}\n`;
          if (exercise.notes) response += `   • Notes: ${exercise.notes}\n`;
          response += `\n`;
        });
      }
      response += `---\n\n`;
    });
  }

  // Nutrition Guidelines
  if (plan.nutritionGuidelines) {
    response += `## 🍎 **NUTRITION GUIDELINES**\n\n`;
    
    const nutrition = plan.nutritionGuidelines;
    
    if (nutrition.calories) {
      response += `**Daily Calorie Target:** ${nutrition.calories}\n\n`;
    }
    
    if (nutrition.macros) {
      response += `**Macronutrient Breakdown:**\n`;
      response += `• **Protein:** ${nutrition.macros.protein || '20-30% of daily calories'}\n`;
      response += `• **Carbohydrates:** ${nutrition.macros.carbs || '40-50% of daily calories'}\n`;
      response += `• **Fats:** ${nutrition.macros.fats || '20-30% of daily calories'}\n\n`;
    }
    
    if (nutrition.mealTiming) {
      response += `**Meal Timing:** ${nutrition.mealTiming}\n\n`;
    }
    
    if (nutrition.supplements) {
      response += `**Supplement Recommendations:** ${nutrition.supplements}\n\n`;
    }
  }

  // Progression Plan
  if (plan.progression) {
    response += `## 📈 **PROGRESSION PLAN**\n\n`;
    response += `${plan.progression}\n\n`;
  }

  // Expected Results
  if (plan.estimatedResults) {
    response += `## 🎯 **EXPECTED RESULTS**\n\n`;
    response += `${plan.estimatedResults}\n\n`;
  }

  // Safety Notes
  if (plan.safetyNotes) {
    response += `## ⚠️ **SAFETY NOTES**\n\n`;
    response += `${plan.safetyNotes}\n\n`;
  }

  // Additional Notes
  if (userInput.injuries && userInput.injuries !== 'None') {
    response += `## 🏥 **INJURY CONSIDERATIONS**\n\n`;
    response += `Based on your reported injuries/conditions: ${userInput.injuries}\n`;
    response += `Please consult with a healthcare professional before starting this plan and modify exercises as needed.\n\n`;
  }

  if (userInput.preferences && userInput.preferences !== 'None') {
    response += `## 💭 **PERSONAL PREFERENCES**\n\n`;
    response += `Your preferences have been considered: ${userInput.preferences}\n\n`;
  }

  if (userInput.dietaryNotes && userInput.dietaryNotes !== 'None') {
    response += `## 🥗 **DIETARY CONSIDERATIONS**\n\n`;
    response += `Your dietary notes: ${userInput.dietaryNotes}\n\n`;
  }

  // Footer
  response += `## 🚀 **GETTING STARTED**\n\n`;
  response += `1. **Start Slow:** Begin with lighter weights and focus on proper form\n`;
  response += `2. **Stay Consistent:** Stick to the schedule for best results\n`;
  response += `3. **Listen to Your Body:** Rest when needed and don't push through pain\n`;
  response += `4. **Track Progress:** Keep a workout journal to monitor improvements\n`;
  response += `5. **Stay Hydrated:** Drink plenty of water before, during, and after workouts\n\n`;
  
  response += `**Remember:** This plan is personalized for you, but always consult with a fitness professional if you have any concerns.\n\n`;
  response += `Good luck on your fitness journey! 💪`;

  return response;
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request
    const validation = validatePlanRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenRouter API key not configured' });
    }

    const {
      goal,
      equipmentAccess = 'None',
      daysPerWeek = 3,
      sessionLength = 45,
      experience = 'Beginner',
      injuries = 'None',
      preferences = 'None',
      dietaryNotes = 'None'
    } = req.body;

    // Structured prompt for consistent output
    const prompt = `Generate a comprehensive fitness plan for a person with the following goals and constraints:

GOAL: ${goal}
EQUIPMENT ACCESS: ${equipmentAccess}
DAYS PER WEEK: ${daysPerWeek}
SESSION LENGTH: ${sessionLength} minutes
EXPERIENCE LEVEL: ${experience}
INJURIES/CONDITIONS: ${injuries}
PREFERENCES: ${preferences}
DIETARY NOTES: ${dietaryNotes}

Please provide a structured response in the following JSON format:

{
  "plan": {
    "goal": "${goal}",
    "summary": "Brief overview of the plan",
    "weeklySchedule": [
      {
        "day": "Day 1",
        "focus": "Workout focus area",
        "exercises": [
          {
            "name": "Exercise name",
            "sets": 3,
            "reps": "10-12",
            "rest": "60 seconds",
            "notes": "Form cues or modifications"
          }
        ],
        "duration": "45 minutes",
        "intensity": "Moderate"
      }
    ],
    "nutritionGuidelines": {
      "calories": "Daily calorie target",
      "macros": {
        "protein": "Protein target",
        "carbs": "Carb target", 
        "fats": "Fat target"
      },
      "mealTiming": "Meal timing recommendations",
      "supplements": "Supplement recommendations if any"
    },
    "progression": "How to progress over time",
    "safetyNotes": "Important safety considerations",
    "estimatedResults": "Expected results timeline"
  }
}

If you cannot provide JSON, provide a clear, structured text response with the same information organized in sections.`;

    const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';

    const response = await axios.post(OPENROUTER_API_URL, {
      model: 'deepseek/deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a certified fitness trainer and nutritionist. Provide safe, effective, and personalized fitness plans. Always prioritize safety and proper form.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const aiResponse = response.data.choices[0].message.content;
    
    // Try to parse JSON response and convert to human-readable format
    try {
      const jsonResponse = JSON.parse(aiResponse);
      
      // Extract useful data and create human-readable response
      const humanReadableResponse = generateHumanReadablePlan(jsonResponse, req.body);
      
      res.status(200).json({
        success: true,
        data: jsonResponse,
        rawResponse: humanReadableResponse,
        message: 'Plan generated successfully'
      });
    } catch (parseError) {
      // Fallback to human-readable response
      res.status(200).json({
        success: true,
        data: null,
        rawResponse: aiResponse,
        message: 'Response provided in human-readable format'
      });
    }

  } catch (error) {
    console.error('Error generating fitness plan:', error);
    if (error.response?.status === 401) {
      res.status(500).json({ error: 'Invalid API key or authentication error' });
    } else if (error.response?.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded for AI service' });
    } else if (error.response?.status === 402) {
      res.status(402).json({ error: 'Payment required or quota exceeded for DeepSeek API. Please check your subscription or API usage.' });
    } else {
      res.status(500).json({ 
        error: 'Failed to generate fitness plan',
        details: error.message 
      });
    }
  }
}