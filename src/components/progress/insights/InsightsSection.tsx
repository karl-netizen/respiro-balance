
import React from 'react';
import { UserPreferences } from "@/context/types";
import { InsightsSection as DetailedInsightsSection } from './insights';

interface InsightsSectionProps {
  preferences: UserPreferences;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ preferences }) => {
  return (
    <DetailedInsightsSection preferences={preferences} />
  );
};

export default InsightsSection;
