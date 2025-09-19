import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIPersonalizationDashboard } from './AIPersonalizationDashboard';
import { AILearningFeedback } from './AILearningFeedback';
import { SessionRecommendation } from '@/lib/ai-personalization/types';

export const AIPersonalizationDemo: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRecommendation, setSelectedRecommendation] = useState<SessionRecommendation | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSessionStart = (recommendation: SessionRecommendation) => {
    setSelectedRecommendation(recommendation);
    setSessionStarted(true);
    
    // Simulate session progression
    setTimeout(() => {
      setSessionCompleted(true);
      setShowFeedback(true);
    }, 3000); // 3 second demo session
  };

  const handleFeedbackSubmitted = () => {
    setShowFeedback(false);
    setSessionStarted(false);
    setSessionCompleted(false);
    setSelectedRecommendation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
              <Brain className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI Personalization Engine
              </h1>
              <p className="text-lg text-muted-foreground">
                Experience intelligent, adaptive wellness recommendations powered by machine learning
              </p>
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Contextual Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                AI analyzes your current mood, stress level, available time, and personal history to create perfectly tailored recommendations.
              </p>
              <div className="flex gap-2">
                <div className="px-2 py-1 bg-primary/10 rounded text-xs">Real-time Analysis</div>
                <div className="px-2 py-1 bg-secondary/10 rounded text-xs">Pattern Recognition</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Smart Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Each recommendation comes with confidence scoring, expected benefits, and personalized reasoning based on your unique profile.
              </p>
              <div className="flex gap-2">
                <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded text-xs">95% Accuracy</div>
                <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs">Predictive Benefits</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Continuous Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                The system learns from your feedback, session completion, and outcomes to continuously improve future recommendations.
              </p>
              <div className="flex gap-2">
                <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded text-xs">Self-Improving</div>
                <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded text-xs">Adaptive ML</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Session Simulation */}
        {sessionStarted && selectedRecommendation && (
          <Card className="mb-6 border-2 border-primary bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Demo Session: {selectedRecommendation.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Simulating a {selectedRecommendation.duration}-minute {selectedRecommendation.sessionType} session...
                </p>
                
                {!sessionCompleted ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span>Session in progress...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Sparkles className="w-5 h-5" />
                    <span>Session completed! Ready for feedback.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback Collection */}
        {showFeedback && selectedRecommendation && (
          <div className="mb-6">
            <AILearningFeedback
              recommendation={selectedRecommendation}
              sessionCompleted={sessionCompleted}
              onFeedbackSubmitted={handleFeedbackSubmitted}
            />
          </div>
        )}

        {/* Main AI Dashboard */}
        {!sessionStarted && (
          <AIPersonalizationDashboard onSessionStart={handleSessionStart} />
        )}

        {/* Technical Architecture Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🚀 Technical Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Machine Learning</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Gradient descent learning</li>
                  <li>• Model weight optimization</li>
                  <li>• Confidence scoring algorithms</li>
                  <li>• Pattern recognition engine</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Data Analysis</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Real-time context analysis</li>
                  <li>• Behavioral pattern tracking</li>
                  <li>• Biometric integration</li>
                  <li>• Preference learning</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Personalization</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Individual user profiling</li>
                  <li>• Contextual recommendations</li>
                  <li>• Adaptive difficulty scaling</li>
                  <li>• Goal-based optimization</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Integration</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• React hooks architecture</li>
                  <li>• TypeScript type safety</li>
                  <li>• Result-based error handling</li>
                  <li>• Functional programming patterns</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIPersonalizationDemo;