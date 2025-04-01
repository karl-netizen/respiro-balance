
import React from 'react';
import { UserPreferences } from "@/context/types";
import { InsightsSectionComponent } from './insights';

interface InsightsSectionProps {
  preferences: UserPreferences;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ preferences }) => {
  return (
    <InsightsSectionComponent preferences={preferences} />
  );
};

export default InsightsSection;
