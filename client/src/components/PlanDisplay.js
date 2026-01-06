import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Calendar, Target, Utensils, TrendingUp, AlertTriangle, Dumbbell, Info, CheckCircle, Trophy } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';
import { generateMotivationalQuote } from '../lib/utils';

const PlanDisplay = ({ plan, onReset }) => {
  const [showRawResponse, setShowRawResponse] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const planContentRef = useRef();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const downloadPlan = async () => {
    if (!planContentRef.current) return;

    try {
      // Temporarily hide buttons to avoid them appearing in the PDF
      const buttons = planContentRef.current.querySelectorAll('button');
      buttons.forEach(btn => btn.style.display = 'none');

      // Capture the plan content as canvas
      const canvas = await html2canvas(planContentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: planContentRef.current.scrollWidth,
        height: planContentRef.current.scrollHeight
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save('fitness-plan.pdf');

      // Restore buttons
      buttons.forEach(btn => btn.style.display = '');

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Enhanced function to parse JSON from raw response
  const parseJsonFromResponse = (rawResponse) => {
    try {
      // Try to find JSON in the response - look for the most complete JSON object
      const jsonMatches = rawResponse.match(/\{[\s\S]*\}/g);
      if (jsonMatches) {
        // Try each match, starting with the longest (most complete)
        const sortedMatches = jsonMatches.sort((a, b) => b.length - a.length);
        for (const match of sortedMatches) {
          try {
            const parsed = JSON.parse(match);
            // Check if it has the expected structure
            if (parsed.plan || parsed.weeklySchedule || parsed.nutritionGuidelines) {
              return parsed;
            }
          } catch (e) {
            continue;
          }
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // Function to render a beautiful table
  const renderTable = (data, title, icon = Info) => {
    if (!data || typeof data !== 'object') return null;

    const entries = Object.entries(data).filter(([_, value]) => 
      value !== null && value !== undefined && value !== ''
    );
    
    if (entries.length === 0) return null;

    const Icon = icon;
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center mb-4">
          <Icon className="w-5 h-5 mr-2 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map(([key, value], index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="whitespace-pre-wrap">{String(value)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Function to render exercises table
  const renderExercisesTable = (exercises, title) => {
    if (!Array.isArray(exercises) || exercises.length === 0) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center mb-4">
          <Dumbbell className="w-5 h-5 mr-2 text-primary-600" />
          <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exercise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reps
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exercises.map((exercise, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {exercise.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {exercise.sets}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {exercise.reps}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {exercise.rest}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="whitespace-pre-wrap">{exercise.notes}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Function to render the complete plan in the exact format requested
  const renderCompletePlan = (planData) => {
    return (
      <div className="space-y-6">
        {/* Title and Summary */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center mb-4">
            <Trophy className="w-8 h-8 mr-3" />
            <h1 className="text-3xl font-bold">🏋️‍♂️ Your Personalized Fitness Plan</h1>
          </div>
          <p className="text-lg opacity-90 leading-relaxed">
            ✨ Congratulations! Your comprehensive {planData.goal?.toLowerCase()} program has been generated. 
            This plan is designed to help you achieve your fitness goals through structured workouts, 
            proper nutrition, and progressive training principles.
          </p>
        </div>

        {/* Plan Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 mr-2 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">📋 Plan Overview</h2>
          </div>
          {renderTable({
            'Primary Goal': planData.goal,
            'Plan Summary': planData.summary,
            'Expected Results': planData.estimatedResults,
            'Progression Strategy': planData.progression,
            'Safety Considerations': planData.safetyNotes
          }, 'Plan Details', Info)}
        </div>

        {/* Weekly Schedule */}
        {planData.weeklySchedule && planData.weeklySchedule.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 mr-2 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">📅 Weekly Schedule</h2>
            </div>
            <div className="space-y-6">
              {planData.weeklySchedule.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-primary-600 mb-4">
                    {day.day}
                  </h3>
                  
                  {/* Day Info */}
                  {renderTable({
                    'Focus Area': day.focus,
                    'Duration': day.duration,
                    'Intensity Level': day.intensity
                  }, 'Day Information', Info)}

                  {/* Exercises */}
                  {day.exercises && day.exercises.length > 0 && (
                    renderExercisesTable(day.exercises, 'Exercises')
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition Guidelines */}
        {planData.nutritionGuidelines && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <Utensils className="w-5 h-5 mr-2 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">🍎 Nutrition Guidelines</h2>
            </div>
            
            {/* Basic Nutrition Info */}
            {renderTable({
              'Daily Calorie Target': planData.nutritionGuidelines.calories,
              'Meal Timing': planData.nutritionGuidelines.mealTiming,
              'Supplement Recommendations': planData.nutritionGuidelines.supplements
            }, 'Nutrition Guidelines', Utensils)}

            {/* Macros */}
            {planData.nutritionGuidelines.macros && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Macronutrient Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nutrient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Target
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(planData.nutritionGuidelines.macros).map(([key, value], index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                            {key}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Success Footer */}
        <Card className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 border-emerald-200">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">
                Ready to Transform Your Fitness Journey?
              </h3>
            </div>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-3xl mx-auto">
              Your personalized plan is scientifically designed to help you achieve your goals effectively while maintaining proper form and safety. 
              Remember to stay consistent, track your progress, and listen to your body throughout your training journey! 💪
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                <Target className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                <div className="text-sm font-semibold text-gray-900">Stay Focused</div>
                <div className="text-xs text-gray-600">Follow your plan consistently</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                <TrendingUp className="w-6 h-6 mx-auto text-green-600 mb-2" />
                <div className="text-sm font-semibold text-gray-900">Track Progress</div>
                <div className="text-xs text-gray-600">Monitor your improvements</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4">
                <Heart className="w-6 h-6 mx-auto text-red-500 mb-2" />
                <div className="text-sm font-semibold text-gray-900">Listen to Body</div>
                <div className="text-xs text-gray-600">Rest when needed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Check if we have structured JSON data
  const hasStructuredData = plan.data && plan.data.plan;
  
  // Try to parse JSON from raw response if no structured data
  const parsedJson = !hasStructuredData ? parseJsonFromResponse(plan.rawResponse) : null;
  
  // Use parsed JSON or structured data - handle both response formats
  let planData = null;
  
  if (parsedJson) {
    // If we parsed JSON from raw response, it might be directly the plan object
    planData = parsedJson.plan || parsedJson;
  } else if (plan.data) {
    // If we have structured data from server, it's in plan.data
    // The AI returns { plan: { ... } }, so we need to extract plan.data.plan
    planData = plan.data.plan || plan.data;
  } else if (plan.plan) {
    // Direct plan object
    planData = plan.plan;
  }

  // Debug logging
  console.log('Plan object:', plan);
  console.log('Parsed JSON:', parsedJson);
  console.log('Plan data:', planData);
  console.log('Has structured data:', hasStructuredData);
  console.log('Plan.data:', plan.data);
  console.log('Plan.data.plan:', plan.data?.plan);

  // If we have structured data, show the beautiful formatted view
  if (planData && (planData.goal || planData.weeklySchedule || planData.nutritionGuidelines)) {
    return (
      <div ref={planContentRef} className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Header with actions */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl mr-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Fitness Plan is Ready!</h2>
                  <p className="text-gray-600">AI-generated and personalized for your goals</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={downloadPlan}
                  variant="outline"
                  className="flex items-center"
                  data-download-button
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={onReset}
                  variant="secondary"
                  className="flex items-center"
                  data-new-plan-button
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Create New Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main content */}
        {renderCompletePlan(planData)}

        {/* Raw Response Toggle */}
        {plan.rawResponse && (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <button
              onClick={() => setShowRawResponse(!showRawResponse)}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              {showRawResponse ? 'Hide' : 'Show'} Raw AI Response
            </button>
            {showRawResponse && (
              <pre className="mt-4 p-4 bg-white rounded border text-sm overflow-x-auto">
                {plan.rawResponse}
              </pre>
            )}
          </div>
        )}
      </div>
    );
  }

  // Debug fallback - show what data we actually have
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Fitness Plan</h2>
          <div className="flex space-x-3">
            <button
              onClick={downloadPlan}
              className="btn-secondary flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button
              onClick={onReset}
              className="btn-secondary flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Plan
            </button>
          </div>
        </div>
      </div>

      {/* Debug Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">Debug Information</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-yellow-700">Plan Object Structure:</h4>
            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
              {JSON.stringify(plan, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-yellow-700">Plan Data:</h4>
            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
              {JSON.stringify(planData, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-yellow-700">Has Structured Data:</h4>
            <p className="text-sm">{hasStructuredData ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <h4 className="font-medium text-yellow-700">Parsed JSON:</h4>
            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
              {JSON.stringify(parsedJson, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Human Readable Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Fitness Plan</h3>
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: plan.rawResponse?.replace(/\n/g, '<br>') || 'No plan data available' }}
          />
        </div>
      </div>

      {/* Toggle Raw Response */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <button
          onClick={() => setShowRawResponse(!showRawResponse)}
          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          {showRawResponse ? 'Hide' : 'Show'} Raw AI Response
        </button>
        {showRawResponse && (
          <pre className="mt-4 p-4 bg-white rounded border text-sm overflow-x-auto">
            {plan.rawResponse}
          </pre>
        )}
      </div>
    </div>
  );
};

export default PlanDisplay;



