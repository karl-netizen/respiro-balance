
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Download, 
  FileText, 
  TrendingUp, 
  Heart, 
  Activity,
  Clock,
  Target,
  Users,
  Lock
} from 'lucide-react';

interface ProfessionalDashboardProps {
  isAuthorized?: boolean;
  patientId?: string;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({
  isAuthorized = false,
  patientId = "patient-001"
}) => {
  const [accessLevel] = useState<'basic' | 'full' | 'clinical'>('full');

  const mockClinicalData = {
    complianceRate: 85,
    overallImprovement: 23,
    riskFactors: ['Elevated baseline stress', 'Irregular sleep patterns'],
    treatmentGoals: ['Reduce resting HR to 65 BPM', 'Improve HRV to 50ms', 'Maintain stress <20%'],
    
    recentMetrics: {
      avgHeartRate: 72,
      avgHRV: 42,
      avgStressLevel: 28,
      sessionCount: 24,
      adherenceRate: 88
    },
    
    clinicalNotes: [
      {
        date: '2024-03-15',
        note: 'Patient showing consistent improvement in stress management. HRV trending upward.',
        provider: 'Dr. Sarah Chen',
        category: 'observation' as const
      },
      {
        date: '2024-03-10',
        note: 'Recommend increasing meditation duration to 20 minutes for optimal benefits.',
        provider: 'Dr. Sarah Chen',
        category: 'recommendation' as const
      },
      {
        date: '2024-03-05',
        note: 'Significant milestone: First week with stress levels consistently below 30%.',
        provider: 'System',
        category: 'milestone' as const
      }
    ]
  };

  if (!isAuthorized) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Professional Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Lock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-medium text-gray-900 mb-1">Access Restricted</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This dashboard is only available to authorized healthcare providers.
          </p>
          <Button variant="outline">Request Access</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Patient Overview
            <Badge variant="outline" className="ml-auto">
              Medical Grade
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Compliance Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {mockClinicalData.complianceRate}%
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Improvement</p>
              <p className="text-2xl font-bold text-blue-600">
                +{mockClinicalData.overallImprovement}%
              </p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Sessions</p>
              <p className="text-2xl font-bold text-purple-600">
                {mockClinicalData.recentMetrics.sessionCount}
              </p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-muted-foreground">Adherence</p>
              <p className="text-2xl font-bold text-orange-600">
                {mockClinicalData.recentMetrics.adherenceRate}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-500" />
            Current Biometric Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="font-medium">Average Heart Rate</span>
              </div>
              <div className="text-right">
                <span className="font-bold">{mockClinicalData.recentMetrics.avgHeartRate} BPM</span>
                <p className="text-xs text-muted-foreground">Target: 65-75 BPM</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Heart Rate Variability</span>
              </div>
              <div className="text-right">
                <span className="font-bold">{mockClinicalData.recentMetrics.avgHRV} ms</span>
                <p className="text-xs text-muted-foreground">Target: >50 ms</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                <span className="font-medium">Stress Management</span>
              </div>
              <div className="text-right">
                <span className="font-bold">{mockClinicalData.recentMetrics.avgStressLevel}%</span>
                <p className="text-xs text-muted-foreground">Target: <25%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Treatment Goals Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockClinicalData.treatmentGoals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{goal}</span>
                <span className="text-sm text-muted-foreground">
                  {65 + index * 10}% complete
                </span>
              </div>
              <Progress value={65 + index * 10} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Clinical Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            Clinical Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockClinicalData.clinicalNotes.map((note, index) => (
            <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <Badge 
                  variant={note.category === 'milestone' ? 'default' : 'outline'}
                  className="text-xs capitalize"
                >
                  {note.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{note.date}</span>
              </div>
              <p className="text-sm mb-1">{note.note}</p>
              <p className="text-xs text-muted-foreground">— {note.provider}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Risk Factors & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Risk Factors & Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Current Risk Factors:</h4>
            <div className="space-y-2">
              {mockClinicalData.riskFactors.map((risk, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">{risk}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="flex gap-2">
            <Button size="sm" className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              Add Clinical Note
            </Button>
            <Button variant="outline" size="sm">
              Update Goals
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalDashboard;
