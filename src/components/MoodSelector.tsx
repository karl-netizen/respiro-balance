
import { useState } from 'react';
import { Button } from "@/components/ui/button";

// Custom implementation of motion functionality 
const customMotion = {
  div: ({ children, ...props }: any) => (
    <div className={`transition-all duration-300 ${props.animate ? props.className : props.initial}`}>
      {children}
    </div>
  )
};

const moods = [
  { id: 'stressed', label: 'Stressed', color: 'bg-orange-100 border-orange-300 text-orange-700' },
  { id: 'anxious', label: 'Anxious', color: 'bg-amber-100 border-amber-300 text-amber-700' },
  { id: 'tired', label: 'Tired', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { id: 'unfocused', label: 'Unfocused', color: 'bg-purple-100 border-purple-300 text-purple-700' },
  { id: 'calm', label: 'Calm', color: 'bg-green-100 border-green-300 text-green-700' },
  { id: 'happy', label: 'Happy', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
];

const MoodSelector = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setShowRecommendation(false);
    setTimeout(() => setShowRecommendation(true), 300);
  };

  const getRecommendation = () => {
    switch (selectedMood) {
      case 'stressed':
        return {
          title: 'Respiro Relief',
          description: 'A gentle breathing meditation to release tension and restore balance.',
          duration: '10 min',
          color: 'bg-orange-50 border-orange-200'
        };
      case 'anxious':
        return {
          title: 'Anxietas Calm',
          description: 'Ground yourself with rhythmic breathing to quiet anxious thoughts.',
          duration: '8 min',
          color: 'bg-amber-50 border-amber-200'
        };
      case 'tired':
        return {
          title: 'Vitalis Renewal',
          description: 'Rejuvenate your energy with invigorating breathing patterns.',
          duration: '5 min',
          color: 'bg-blue-50 border-blue-200'
        };
      case 'unfocused':
        return {
          title: 'Concentro Focus',
          description: 'Sharpen your attention with centered breathing techniques.',
          duration: '7 min',
          color: 'bg-purple-50 border-purple-200'
        };
      case 'calm':
        return {
          title: 'Serena Deepening',
          description: 'Extend your sense of peace with sustained breathing practices.',
          duration: '12 min',
          color: 'bg-green-50 border-green-200'
        };
      case 'happy':
        return {
          title: 'Laetus Amplifier',
          description: 'Celebrate and expand your positive energy through joyful breathing.',
          duration: '6 min',
          color: 'bg-yellow-50 border-yellow-200'
        };
      default:
        return {
          title: 'Respiro Equilibrium',
          description: 'A balanced breathing practice for harmony in your day.',
          duration: '10 min',
          color: 'bg-mindflow-light border-mindflow/30'
        };
    }
  };

  const recommendation = getRecommendation();

  return (
    <section className="py-16 px-6" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-float-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How is your breath today?</h2>
          <p className="text-foreground/70">
            Select your current mood and we'll recommend the perfect breathing meditation for your balance.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {moods.map((mood, index) => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border 
                transition-all duration-300 hover:-translate-y-1 hover:shadow-md
                ${mood.color}
                ${selectedMood === mood.id ? 'ring-2 ring-offset-2 ring-primary' : ''}
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-2xl mb-2">
                {mood.id === 'stressed' && '😖'}
                {mood.id === 'anxious' && '😰'}
                {mood.id === 'tired' && '😴'}
                {mood.id === 'unfocused' && '🤔'}
                {mood.id === 'calm' && '😌'}
                {mood.id === 'happy' && '😊'}
              </div>
              <span className="font-medium">{mood.label}</span>
            </button>
          ))}
        </div>
        
        <div className="flex justify-center">
          <div 
            className={`
              w-full max-w-2xl glassmorphism-card p-6
              transform transition-all duration-500 ease-in-out
              ${showRecommendation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
              ${selectedMood ? recommendation.color : ''}
            `}
          >
            {selectedMood ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="md:flex-1">
                  <h3 className="text-xl font-semibold mb-2">{recommendation.title}</h3>
                  <p className="text-foreground/70 mb-4">{recommendation.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/50 text-sm font-medium">
                      {recommendation.duration}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/50 text-sm font-medium">
                      Breath-Focused
                    </span>
                  </div>
                </div>
                
                <div>
                  <Button className="bg-primary hover:bg-mindflow-dark">
                    Begin Breathing Session
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-foreground/70">
                  Select a mood above to get a personalized breathing meditation recommendation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoodSelector;
