import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Code, Key, Webhook, Copy, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface APIKey {
  id: string
  name: string
  key: string
  permissions: string[]
  lastUsed: string
  status: 'active' | 'revoked'
  rateLimit: number
}

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  status: 'active' | 'inactive'
  lastTriggered: string
}

export const APIManagement: React.FC = () => {
  const [apiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production Integration',
      key: 'rsp_live_1234567890abcdef',
      permissions: ['read:users', 'write:sessions', 'read:analytics'],
      lastUsed: new Date().toISOString(),
      status: 'active',
      rateLimit: 1000
    }
  ])

  const [webhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: 'User Registration Hook',
      url: 'https://api.company.com/webhooks/user-registration',
      events: ['user.created', 'user.updated'],
      status: 'active',
      lastTriggered: new Date().toISOString()
    }
  ])

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  return (
    <div className="space-y-6">
      {/* API Keys Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Key className="h-4 w-4 mr-2" />
                  Generate API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate New API Key</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input id="keyName" placeholder="e.g., Production Integration" />
                  </div>
                  <div>
                    <Label>Permissions</Label>
                    <div className="space-y-2 mt-2">
                      {['read:users', 'write:users', 'read:sessions', 'write:sessions', 'read:analytics'].map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Switch id={permission} />
                          <Label htmlFor={permission}>{permission}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="rateLimit">Rate Limit (requests/hour)</Label>
                    <Input id="rateLimit" type="number" defaultValue="1000" />
                  </div>
                  <Button className="w-full">Generate API Key</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Rate Limit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-muted rounded">
                        {showKeys[apiKey.id] ? apiKey.key : '••••••••••••••••'}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{apiKey.rateLimit}/hour</TableCell>
                  <TableCell>
                    <Badge variant={apiKey.status === 'active' ? 'default' : 'destructive'}>
                      {apiKey.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Webhooks Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhooks
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Webhook className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Webhook</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="webhookName">Webhook Name</Label>
                    <Input id="webhookName" placeholder="e.g., User Registration Hook" />
                  </div>
                  <div>
                    <Label htmlFor="webhookUrl">Endpoint URL</Label>
                    <Input id="webhookUrl" placeholder="https://api.yourcompany.com/webhooks/endpoint" />
                  </div>
                  <div>
                    <Label>Events</Label>
                    <div className="space-y-2 mt-2">
                      {['user.created', 'user.updated', 'session.completed', 'analytics.updated'].map((event) => (
                        <div key={event} className="flex items-center space-x-2">
                          <Switch id={event} />
                          <Label htmlFor={event}>{event}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full">Add Webhook</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Triggered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium">{webhook.name}</TableCell>
                  <TableCell>
                    <code className="text-sm">{webhook.url}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={webhook.status === 'active' ? 'default' : 'secondary'}>
                      {webhook.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(webhook.lastTriggered).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Test
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            API Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Available Endpoints</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">GET</Badge>
                  <code>/api/v1/users</code>
                  <span className="text-sm text-muted-foreground">Get users list</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">GET</Badge>
                  <code>/api/v1/sessions</code>
                  <span className="text-sm text-muted-foreground">Get meditation sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">POST</Badge>
                  <code>/api/v1/sessions</code>
                  <span className="text-sm text-muted-foreground">Create new session</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">GET</Badge>
                  <code>/api/v1/analytics</code>
                  <span className="text-sm text-muted-foreground">Get analytics data</span>
                </div>
              </div>
            </div>
            <Button variant="outline">
              View Full Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}