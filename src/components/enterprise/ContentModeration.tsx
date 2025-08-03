import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Shield, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  type: 'meditation' | 'article' | 'video'
  status: 'approved' | 'pending' | 'rejected'
  author: string
  created_at: string
  flags: number
}

export const ContentModeration: React.FC = () => {
  const [content] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Deep Breathing Meditation',
      type: 'meditation',
      status: 'approved',
      author: 'Dr. Sarah Johnson',
      created_at: new Date().toISOString(),
      flags: 0
    },
    {
      id: '2',
      title: 'Stress Management Techniques',
      type: 'article',
      status: 'pending',
      author: 'Mike Chen',
      created_at: new Date().toISOString(),
      flags: 2
    }
  ])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Content Moderation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {content.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'approved' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>{item.flags}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}