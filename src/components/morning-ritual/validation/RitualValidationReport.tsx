
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface ValidationItem {
  feature: string;
  status: 'implemented' | 'partial' | 'missing' | 'needs-improvement';
  details: string;
  priority: 'high' | 'medium' | 'low';
}

const RitualValidationReport: React.FC = () => {
  const validationItems: ValidationItem[] = [
    // My Rituals Tab - Timeline & Management
    {
      feature: "Daily Status Dashboard",
      status: "partial",
      details: "Basic stats shown but missing current date context, detailed progress breakdown, and motivational messaging",
      priority: "high"
    },
    {
      feature: "Weekly Performance Summary",
      status: "missing",
      details: "No weekly view, completion rates, or daily indicators implemented",
      priority: "high"
    },
    {
      feature: "Interactive Ritual Timeline",
      status: "implemented",
      details: "Time-ordered display with basic completion tracking exists",
      priority: "medium"
    },
    {
      feature: "Comprehensive Completion Flow",
      status: "partial",
      details: "Basic completion exists but missing rating system, time tracking, and celebration animations",
      priority: "medium"
    },
    {
      feature: "Advanced Streak Tracking",
      status: "partial",
      details: "Basic streak counting implemented but missing risk assessment and motivational support",
      priority: "medium"
    },

    // Create New Tab
    {
      feature: "Guided Ritual Creation Form",
      status: "implemented",
      details: "Basic form with validation exists",
      priority: "low"
    },
    {
      feature: "Intelligent Timing & Schedule",
      status: "partial",
      details: "Basic time selection but missing smart recommendations and conflict detection",
      priority: "medium"
    },
    {
      feature: "Advanced Customization",
      status: "partial",
      details: "Priority and basic reminders but missing dependencies and weather considerations",
      priority: "low"
    },
    {
      feature: "Preview & Validation",
      status: "missing",
      details: "No preview system or impact assessment implemented",
      priority: "medium"
    },

    // Suggestions Tab
    {
      feature: "Curated Template Library",
      status: "implemented",
      details: "Basic suggestions with predefined templates exist",
      priority: "low"
    },
    {
      feature: "Personalized Recommendations",
      status: "missing",
      details: "No profile-based or pattern-based suggestions implemented",
      priority: "medium"
    },
    {
      feature: "Educational Content",
      status: "missing",
      details: "No how-to guides or science-based content",
      priority: "low"
    },

    // Analytics & Insights
    {
      feature: "Progress Analytics Dashboard",
      status: "missing",
      details: "No comprehensive analytics or behavioral intelligence",
      priority: "medium"
    },
    {
      feature: "Pattern Recognition",
      status: "missing",
      details: "No optimal timing analysis or success factor identification",
      priority: "medium"
    },

    // Smart Notifications
    {
      feature: "Intelligent Reminder System",
      status: "missing",
      details: "No contextual notifications or adaptive learning",
      priority: "high"
    },
    {
      feature: "Streak Protection",
      status: "missing",
      details: "No risk detection or emergency intervention protocols",
      priority: "high"
    },

    // Social Features
    {
      feature: "Community Integration",
      status: "missing",
      details: "No sharing ecosystem or accountability systems",
      priority: "low"
    }
  ];

  const getStatusIcon = (status: ValidationItem['status']) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'partial':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'missing':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'needs-improvement':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: ValidationItem['status']) => {
    const variants = {
      implemented: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      missing: 'bg-red-100 text-red-800',
      'needs-improvement': 'bg-orange-100 text-orange-800'
    };

    return (
      <Badge className={variants[status]}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: ValidationItem['priority']) => {
    const variants = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={variants[priority]}>
        {priority} priority
      </Badge>
    );
  };

  const statusCounts = validationItems.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const implementationPercentage = Math.round(
    ((statusCounts.implemented || 0) + (statusCounts.partial || 0) * 0.5) / 
    validationItems.length * 100
  );

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Morning Ritual Feature Validation Report
            <Badge className="bg-blue-100 text-blue-800">
              {implementationPercentage}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statusCounts.implemented || 0}
              </div>
              <div className="text-sm text-muted-foreground">Implemented</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {statusCounts.partial || 0}
              </div>
              <div className="text-sm text-muted-foreground">Partial</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {statusCounts.missing || 0}
              </div>
              <div className="text-sm text-muted-foreground">Missing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {statusCounts['needs-improvement'] || 0}
              </div>
              <div className="text-sm text-muted-foreground">Needs Work</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Validation Items */}
      <div className="space-y-4">
        {validationItems.map((item, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getStatusIcon(item.status)}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.feature}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.details}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  {getStatusBadge(item.status)}
                  {getPriorityBadge(item.priority)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Steps Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Badge className="bg-red-100 text-red-800">High Priority</Badge>
              <span className="text-sm">
                Implement Daily Status Dashboard with current date, progress breakdown, and motivational messaging
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-red-100 text-red-800">High Priority</Badge>
              <span className="text-sm">
                Add Weekly Performance Summary with completion rates and daily indicators
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-red-100 text-red-800">High Priority</Badge>
              <span className="text-sm">
                Implement Intelligent Reminder System with contextual notifications
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>
              <span className="text-sm">
                Enhance completion flow with rating system and time tracking
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>
              <span className="text-sm">
                Add progress analytics dashboard with behavioral intelligence
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RitualValidationReport;
