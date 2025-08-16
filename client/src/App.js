import React, { useState, useEffect } from 'react';
import FitnessPlannerForm from './components/FitnessPlannerForm';
import { generateMotivationalQuote } from './lib/utils';
import { Dumbbell, Zap, Target, TrendingUp } from 'lucide-react';
import './App.css';

function App() {
  const [quote, setQuote] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setQuote(generateMotivationalQuote());
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <header className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg mr-4">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                RAMP Fitness
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              Transform your fitness journey with AI-powered personalized workout and nutrition plans
            </p>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">AI-Powered Plans</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <Target className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Goal-Focused</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-200">
                <TrendingUp className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Progressive Training</span>
              </div>
            </div>
            
            {/* Motivational quote */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-gray-700 italic font-medium text-lg">
                "{quote}"
              </p>
            </div>
          </header>
          
          <FitnessPlannerForm />
        </div>
      </div>
    </div>
  );
}

export default App;




