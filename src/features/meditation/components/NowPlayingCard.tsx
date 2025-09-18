import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play } from 'lucide-react';
import { MeditationContent } from '../types/meditation.types';

interface NowPlayingCardProps {
  content: MeditationContent;
}

export const NowPlayingCard: React.FC<NowPlayingCardProps> = ({ content }) => {
  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-primary" />
          Now Playing: {content.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{content.description}</p>
        <div className="flex items-center gap-4 text-sm">
          <span>Duration: {content.duration} minutes</span>
          <span>Category: {content.category}</span>
          {content.instructor && <span>Instructor: {content.instructor}</span>}
        </div>
      </CardContent>
    </Card>
  );
};