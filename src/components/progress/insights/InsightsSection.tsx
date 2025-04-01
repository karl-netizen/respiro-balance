
import React from 'react';
import { UserPreferences } from "@/context/types";
import { InsightCard, ProgressReportCard } from './insights';
import { InsightsSection as DetailedInsightsSection } from './insights/InsightsSection';

interface InsightsSectionProps {
  preferences: UserPreferences;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ preferences }) => {
  return (
    <DetailedInsightsSection preferences={preferences} />
  );
};

export default InsightsSection;
