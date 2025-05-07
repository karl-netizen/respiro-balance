
import React from 'react';
import { Wind } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TechniqueCardProps {
  technique: string;
  isSelected: boolean;
  title: string;
  subtitle: string;
  description: string;
  forwardedRef: React.Ref<HTMLDivElement>;
  onClick: () => void;
}

const TechniqueCard: React.FC<TechniqueCardProps> = ({
  technique,
  isSelected,
  title,
  subtitle,
  description,
  forwardedRef,
  onClick
}) => {
  return (
    <Card 
      ref={forwardedRef}
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start mb-4">
          <Wind className="h-8 w-8 text-primary mr-3" />
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <p className="text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default TechniqueCard;
