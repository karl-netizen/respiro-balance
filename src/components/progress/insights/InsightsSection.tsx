
import React from 'react';
import { UserPreferences } from "@/context/types";
import { default as InsightsSectionComponent } from './insights/InsightsSection';

interface InsightsSectionProps {
  preferences: UserPreferences;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ preferences }) => {
  return (
    <InsightsSectionComponent preferences={preferences} />
  );
};

export default InsightsSection;
