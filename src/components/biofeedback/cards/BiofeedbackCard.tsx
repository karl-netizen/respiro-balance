
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ReactNode } from "react";

interface BiofeedbackCardProps {
  children: ReactNode;
  title: string;
  description: string;
  icon: ReactNode;
}

const BiofeedbackCard: React.FC<BiofeedbackCardProps> = ({ 
  children, 
  title, 
  description, 
  icon 
}) => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="bg-primary/10 p-2.5 rounded-full text-primary">
          {icon}
        </div>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export default BiofeedbackCard;
