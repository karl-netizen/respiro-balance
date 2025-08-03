import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Building, Users, Plus, Edit, Trash2 } from 'lucide-react'

interface Team {
  id: string
  name: string
  department: string
  manager: string
  memberCount: number
  avgWellnessScore: number
  status: 'active' | 'inactive'
}

export const TeamManagement: React.FC = () => {
  const [teams] = useState<Team[]>([
    {
      id: '1',
      name: 'Engineering Team Alpha',
      department: 'Engineering',
      manager: 'John Doe',
      memberCount: 12,
      avgWellnessScore: 7.8,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sales West Coast',
      department: 'Sales',
      manager: 'Jane Smith',
      memberCount: 8,
      avgWellnessScore: 8.2,
      status: 'active'
    }
  ])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Team Management
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="teamName">Team Name</Label>
                    <Input id="teamName" placeholder="Enter team name" />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="manager">Team Manager</Label>
                    <Input id="manager" placeholder="Select or enter manager" />
                  </div>
                  <Button className="w-full">Create Team</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Wellness Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.department}</TableCell>
                  <TableCell>{team.manager}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {team.memberCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={team.avgWellnessScore >= 8 ? 'default' : 'secondary'}>
                      {team.avgWellnessScore}/10
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={team.status === 'active' ? 'default' : 'secondary'}>
                      {team.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
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