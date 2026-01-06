import React, { useState } from 'react';
import { Target, Dumbbell, User, AlertTriangle, Heart, Utensils, Sparkles, Calendar, Clock, Award } from 'lucide-react';
import axios from 'axios';
import PlanDisplay from './PlanDisplay';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';
import { PulseLoader } from './ui/LoadingSpinner';
import { cn } from '../lib/utils';

const FitnessPlannerForm = () => {
  const [formData, setFormData] = useState({
    goal: '',
    equipmentAccess: '',
    daysPerWeek: '',
    sessionLength: '',
    experience: '',
    injuries: '',
    preferences: '',
    dietaryNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.goal) {
      newErrors.goal = 'Please select a fitness goal';
    }

    if (formData.daysPerWeek && (formData.daysPerWeek < 1 || formData.daysPerWeek > 7)) {
      newErrors.daysPerWeek = 'Days per week must be between 1 and 7';
    }

    if (formData.sessionLength && (formData.sessionLength < 15 || formData.sessionLength > 180)) {
      newErrors.sessionLength = 'Session length must be between 15 and 180 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setPlan(null);

    try {
      const response = await axios.post('/api/generate-plan', formData);
      
      if (response.data.success) {
        setPlan(response.data);
      } else {
        setError('Failed to generate plan. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while generating your plan');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      goal: '',
      equipmentAccess: '',
      daysPerWeek: '',
      sessionLength: '',
      experience: '',
      injuries: '',
      preferences: '',
      dietaryNotes: ''
    });
    setErrors({});
    setPlan(null);
    setError('');
  };

  const goalIcons = {
    'Gain Muscle': Dumbbell,
    'Lose Fat': Target,
    'Both': Award
  };

  const goalDescriptions = {
    'Gain Muscle': 'Build lean muscle mass and strength',
    'Lose Fat': 'Burn fat while maintaining muscle',
    'Both': 'Recomposition - build muscle and lose fat'
  };

  return (
    <div className="max-w-6xl mx-auto">
      {!plan ? (
        <div className="space-y-8">
          {/* Progress indicator */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Your Details</span>
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded-full">
                <div className="w-full h-full bg-blue-600 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm font-bold">2</span>
                </div>
                <span className="text-sm text-gray-500">AI Generation</span>
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm font-bold">3</span>
                </div>
                <span className="text-sm text-gray-500">Your Plan</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Goal Selection */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center text-2xl">
                  <Target className="w-6 h-6 mr-3 text-blue-600" />
                  What's Your Fitness Goal?
                </CardTitle>
                <p className="text-gray-600 mt-2">Choose your primary objective to get a tailored plan</p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Gain Muscle', 'Lose Fat', 'Both'].map((goal) => {
                    const IconComponent = goalIcons[goal];
                    return (
                      <label key={goal} className="relative group cursor-pointer">
                        <input
                          type="radio"
                          name="goal"
                          value={goal}
                          checked={formData.goal === goal}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={cn(
                          "p-6 border-2 rounded-xl transition-all duration-300 transform hover:scale-105",
                          formData.goal === goal
                            ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        )}>
                          <div className="text-center">
                            <div className={cn(
                              "w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center",
                              formData.goal === goal ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                            )}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div className="font-semibold text-lg mb-2">{goal}</div>
                            <div className="text-sm text-gray-600">{goalDescriptions[goal]}</div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.goal && <p className="text-red-600 text-sm mt-4 flex items-center"><AlertTriangle className="w-4 h-4 mr-1" />{errors.goal}</p>}
              </CardContent>
            </Card>

            {/* Equipment & Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Dumbbell className="w-5 h-5 mr-3 text-blue-600" />
                    Equipment & Schedule
                  </CardTitle>
                  <p className="text-gray-600 text-sm">Tell us about your workout setup and availability</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Access</label>
                    <Select
                      name="equipmentAccess"
                      value={formData.equipmentAccess}
                      onChange={handleInputChange}
                    >
                      <option value="">Select equipment access</option>
                      <option value="None">🏠 No equipment (bodyweight only)</option>
                      <option value="Basic">🏋️ Basic (dumbbells, resistance bands)</option>
                      <option value="Home Gym">🏡 Home gym (barbell, rack, etc.)</option>
                      <option value="Full Gym">🏢 Full gym access</option>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Days per Week
                      </label>
                      <Input
                        type="number"
                        name="daysPerWeek"
                        value={formData.daysPerWeek}
                        onChange={handleInputChange}
                        min="1"
                        max="7"
                        placeholder="3"
                      />
                      {errors.daysPerWeek && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />{errors.daysPerWeek}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Session Length (min)
                      </label>
                      <Input
                        type="number"
                        name="sessionLength"
                        value={formData.sessionLength}
                        onChange={handleInputChange}
                        min="15"
                        max="180"
                        placeholder="45"
                      />
                      {errors.sessionLength && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />{errors.sessionLength}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <User className="w-5 h-5 mr-3 text-blue-600" />
                    Personal Details
                  </CardTitle>
                  <p className="text-gray-600 text-sm">Help us customize your training approach</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                    <Select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                    >
                      <option value="">Select experience level</option>
                      <option value="Beginner">🌱 Beginner (0-6 months)</option>
                      <option value="Intermediate">💪 Intermediate (6 months - 2 years)</option>
                      <option value="Advanced">🏆 Advanced (2+ years)</option>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Injuries/Conditions</label>
                    <Textarea
                      name="injuries"
                      value={formData.injuries}
                      onChange={handleInputChange}
                      placeholder="Any injuries, medical conditions, or limitations..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preferences & Dietary Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Heart className="w-5 h-5 mr-3 text-red-500" />
                    Workout Preferences
                  </CardTitle>
                  <p className="text-gray-600 text-sm">Share your workout likes, dislikes, and preferences</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="preferences"
                    value={formData.preferences}
                    onChange={handleInputChange}
                    placeholder="e.g., I love compound movements, prefer morning workouts, enjoy HIIT sessions..."
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Utensils className="w-5 h-5 mr-3 text-green-600" />
                    Dietary Information
                  </CardTitle>
                  <p className="text-gray-600 text-sm">Help us create nutrition guidelines that work for you</p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="dietaryNotes"
                    value={formData.dietaryNotes}
                    onChange={handleInputChange}
                    placeholder="e.g., Vegetarian, lactose intolerant, prefer high protein meals..."
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Submit Button */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium">Ready to transform your fitness journey?</span>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="xl"
                    className="w-full max-w-md mx-auto relative overflow-hidden"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <PulseLoader className="mr-3" />
                        <span>Generating Your Plan...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate My Fitness Plan
                      </div>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Our AI will analyze your information and create a personalized workout and nutrition plan tailored specifically for you.
                  </p>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center text-red-700">
                    <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Error generating plan</p>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      ) : (
        <PlanDisplay plan={plan} onReset={resetForm} />
      )}
    </div>
  );
};

export default FitnessPlannerForm;
