
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Clock } from 'lucide-react';

export const ConversionAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data
  const conversionData = [
    { name: 'Week 1', free: 1200, premium: 45, premiumPro: 12, premiumPlus: 3 },
    { name: 'Week 2', free: 1350, premium: 52, premiumPro: 15, premiumPlus: 4 },
    { name: 'Week 3', free: 1180, premium: 48, premiumPro: 11, premiumPlus: 2 },
    { name: 'Week 4', free: 1420, premium: 58, premiumPro: 18, premiumPlus: 5 }
  ];

  const revenueData = [
    { name: 'Jan', mrr: 12500, users: 850 },
    { name: 'Feb', mrr: 14200, users: 920 },
    { name: 'Mar', mrr: 16800, users: 1050 },
    { name: 'Apr', mrr: 18900, users: 1180 },
  ];

  const churnData = [
    { tier: 'Premium', rate: 5.2, color: '#3b82f6' },
    { tier: 'Premium Pro', rate: 3.8, color: '#8b5cf6' },
    { tier: 'Premium Plus', rate: 2.1, color: '#f59e0b' }
  ];

  const funnelData = [
    { stage: 'Visitors', count: 10000, conversion: 100 },
    { stage: 'Signups', count: 2500, conversion: 25 },
    { stage: 'Trial Starts', count: 800, conversion: 32 },
    { stage: 'Paid Conversion', count: 240, conversion: 30 }
  ];

  const StatCard: React.FC<{ title: string; value: string; change: number; icon: React.ReactNode }> = ({ title, value, change, icon }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center mt-1">
              {change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          </div>
          <div className="text-muted-foreground">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Conversion Analytics</h2>
          <p className="text-muted-foreground">Monitor your subscription performance and revenue metrics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Recurring Revenue"
          value="$18,900"
          change={12.5}
          icon={<DollarSign className="w-6 h-6" />}
        />
        <StatCard
          title="Conversion Rate"
          value="3.2%"
          change={8.3}
          icon={<Target className="w-6 h-6" />}
        />
        <StatCard
          title="Active Subscribers"
          value="1,180"
          change={15.7}
          icon={<Users className="w-6 h-6" />}
        />
        <StatCard
          title="Avg. Time to Convert"
          value="4.2 days"
          change={-5.1}
          icon={<Clock className="w-6 h-6" />}
        />
      </div>

      <Tabs defaultValue="conversions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>

        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Conversions by Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="premium" fill="#3b82f6" name="Premium" />
                  <Bar dataKey="premiumPro" fill="#8b5cf6" name="Premium Pro" />
                  <Bar dataKey="premiumPlus" fill="#f59e0b" name="Premium Plus" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">4.1%</div>
                  <div className="text-sm text-muted-foreground">Premium Conversion</div>
                  <Badge variant="secondary" className="mt-2">+0.3% vs last month</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">1.8%</div>
                  <div className="text-sm text-muted-foreground">Premium Pro Conversion</div>
                  <Badge variant="secondary" className="mt-2">+0.1% vs last month</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">0.4%</div>
                  <div className="text-sm text-muted-foreground">Premium Plus Conversion</div>
                  <Badge variant="secondary" className="mt-2">+0.1% vs last month</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Recurring Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="mrr" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Standard ($6.99/mo)</span>
                    <span className="font-semibold">$4,890</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Premium ($12.99/mo)</span>
                    <span className="font-semibold">$14,010</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Revenue Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>ARPU (Average Revenue Per User)</span>
                    <span className="font-semibold">$16.02</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Lifetime Value</span>
                    <span className="font-semibold">$384</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Payback Period</span>
                    <span className="font-semibold">2.1 months</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnelData.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="text-right">
                        <span className="font-semibold">{stage.count.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({stage.conversion}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${stage.conversion}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Churn Rate by Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={churnData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 10]} />
                  <YAxis dataKey="tier" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">94.2%</div>
                <div className="text-sm text-muted-foreground">Overall Retention Rate</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">8.4 months</div>
                <div className="text-sm text-muted-foreground">Average Subscription Length</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">2.3x</div>
                <div className="text-sm text-muted-foreground">LTV:CAC Ratio</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
