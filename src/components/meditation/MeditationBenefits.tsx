
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, ThumbsUp } from "lucide-react";

const MeditationBenefits = () => {
  return (
    <section className="py-12 px-6 bg-secondary/20" id="meditation-benefits">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Benefits of Regular Meditation</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Cultivating a consistent meditation practice provides numerous benefits for both mind and body.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-primary" />
                Cognitive Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-foreground/70">
                <li>Improved focus and concentration</li>
                <li>Enhanced memory retention</li>
                <li>Better decision-making abilities</li>
                <li>Increased creativity and problem-solving</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-primary" />
                Emotional Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-foreground/70">
                <li>Reduced stress and anxiety</li>
                <li>Improved emotional regulation</li>
                <li>Greater resilience to challenges</li>
                <li>Enhanced sense of well-being</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ThumbsUp className="mr-2 h-5 w-5 text-primary" />
                Physical Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-foreground/70">
                <li>Lowered blood pressure</li>
                <li>Improved sleep quality</li>
                <li>Reduced inflammation</li>
                <li>Enhanced immune function</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MeditationBenefits;
