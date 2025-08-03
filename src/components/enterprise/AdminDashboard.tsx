import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserManagement } from './UserManagement'
import { ContentModeration } from './ContentModeration'
import { EnterpriseAnalytics } from './EnterpriseAnalytics'
import { WhiteLabelSettings } from './WhiteLabelSettings'
import { TeamManagement } from './TeamManagement'
import { APIManagement } from './APIManagement'
import { Users, Shield, BarChart3, Settings, Building, Code } from 'lucide-react'
import { useFeatureAccess } from '@/hooks/useFeatureAccess'

export const AdminDashboard: React.FC = () => {
  const { getFeatureFlags, currentTier } = useFeatureAccess()
  const features = getFeatureFlags()
  const [activeTab, setActiveTab] = useState('users')

  if (!features.whiteLabel && currentTier !== 'premium_plus') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Enterprise admin features require Premium Plus subscription.
            </p>
            <Button className="mt-4">
              Upgrade to Premium Plus
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Enterprise Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, content, and enterprise settings
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {currentTier.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="teams">
          <TeamManagement />
        </TabsContent>

        <TabsContent value="content">
          <ContentModeration />
        </TabsContent>

        <TabsContent value="analytics">
          <EnterpriseAnalytics />
        </TabsContent>

        <TabsContent value="branding">
          <WhiteLabelSettings />
        </TabsContent>

        <TabsContent value="api">
          <APIManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}