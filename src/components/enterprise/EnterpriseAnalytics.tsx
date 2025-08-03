import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Users, Activity, Target, DollarSign, Download, Calendar } from 'lucide-react'
import { logger } from '@/lib/logging'

interface AnalyticsData {
  wellnessMetrics: {
    totalUsers: number
    activeUsers: number
    engagementRate: number
    avgWellnessScore: number
    stressReduction: number
    productivityIncrease: number
    absenteeismReduction: number
  }
  usageAnalytics: {
    dailyActiveUsers: Array<{ date: string; users: number }>
    sessionsByDepartment: Array<{ department: string; sessions: number; color: string }>
    popularContent: Array<{ title: string; plays: number; duration: number }>
  }
  roiMetrics: {
    monthlySavings: number
    productivityGains: number
    healthcareCostReduction: number
    employeeSatisfaction: number
  }
}

export const EnterpriseAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange, selectedDepartment])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      // Mock analytics data
      const mockData: AnalyticsData = {
        wellnessMetrics: {
          totalUsers: 347,
          activeUsers: 289,
          engagementRate: 83.2,
          avgWellnessScore: 7.4,
          stressReduction: 28.5,
          productivityIncrease: 18.7,
          absenteeismReduction: 12.3
        },
        usageAnalytics: {
          dailyActiveUsers: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            users: Math.floor(Math.random() * 100) + 200
          })),
          sessionsByDepartment: [
            { department: 'Engineering', sessions: 1250, color: '#8884d8' },
            { department: 'Sales', sessions: 890, color: '#82ca9d' },
            { department: 'Marketing', sessions: 645, color: '#ffc658' },
            { department: 'HR', sessions: 420, color: '#ff7300' },
            { department: 'Finance', sessions: 315, color: '#00ff00' }
          ],
          popularContent: [
            { title: 'Stress Relief Meditation', plays: 2340, duration: 600 },
            { title: 'Focus Enhancement', plays: 1890, duration: 900 },
            { title: 'Team Building Mindfulness', plays: 1560, duration: 1200 },
            { title: 'Energy Boost Session', plays: 1240, duration: 450 },
            { title: 'Sleep Preparation', plays: 980, duration: 1800 }
          ]
        },
        roiMetrics: {
          monthlySavings: 28500,
          productivityGains: 47200,
          healthcareCostReduction: 15600,
          employeeSatisfaction: 8.9
        }
      }
      
      setAnalytics(mockData)
      logger.info('Enterprise analytics loaded', { timeRange, department: selectedDepartment })
    } catch (error) {
      logger.error('Failed to load analytics', error as Error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async () => {
    try {
      // Mock report export
      logger.info('Analytics report exported', { timeRange, department: selectedDepartment })
      
      // In real implementation, generate and download PDF/Excel report
      const reportData = {
        timestamp: new Date().toISOString(),
        timeRange,
        department: selectedDepartment,
        analytics
      }
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `wellness-report-${timeRange}-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      logger.error('Failed to export report', error as Error)
    }
  }

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-8 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const pieChartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00']

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Enterprise Analytics
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{analytics.wellnessMetrics.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+12.3% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold">{analytics.wellnessMetrics.engagementRate}%</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={analytics.wellnessMetrics.engagementRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wellness Score</p>
                <p className="text-2xl font-bold">{analytics.wellnessMetrics.avgWellnessScore}/10</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+0.8 improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ROI Monthly</p>
                <p className="text-2xl font-bold">${analytics.roiMetrics.monthlySavings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+15.2% ROI</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Active Users */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.usageAnalytics.dailyActiveUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sessions by Department */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.usageAnalytics.sessionsByDepartment}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ department, percent }) => `${department} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sessions"
                >
                  {analytics.usageAnalytics.sessionsByDepartment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ROI Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>ROI Impact Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Stress Reduction</span>
                <span className="text-sm font-bold">{analytics.wellnessMetrics.stressReduction}%</span>
              </div>
              <Progress value={analytics.wellnessMetrics.stressReduction} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Productivity Increase</span>
                <span className="text-sm font-bold">{analytics.wellnessMetrics.productivityIncrease}%</span>
              </div>
              <Progress value={analytics.wellnessMetrics.productivityIncrease} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Absenteeism Reduction</span>
                <span className="text-sm font-bold">{analytics.wellnessMetrics.absenteeismReduction}%</span>
              </div>
              <Progress value={analytics.wellnessMetrics.absenteeismReduction} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Content */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.usageAnalytics.popularContent.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{content.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(content.duration / 60)} minutes • {content.plays} plays
                  </p>
                </div>
                <Badge variant="secondary">
                  #{index + 1}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}