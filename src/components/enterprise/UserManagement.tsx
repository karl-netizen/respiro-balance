import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { Search, UserPlus, Edit, Trash2, Shield, Mail } from 'lucide-react'
import { logger } from '@/lib/logging'

interface EnterpriseUser {
  id: string
  user_id: string
  email: string
  full_name: string
  role: 'admin' | 'manager' | 'user'
  status: 'active' | 'suspended' | 'pending'
  department: string
  last_active: string
  created_at: string
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<EnterpriseUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<EnterpriseUser | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      
      // Mock enterprise users data
      const mockUsers: EnterpriseUser[] = [
        {
          id: '1',
          user_id: 'user-1',
          email: 'john.doe@company.com',
          full_name: 'John Doe',
          role: 'admin',
          status: 'active',
          department: 'IT',
          last_active: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
        },
        {
          id: '2',
          user_id: 'user-2',
          email: 'jane.smith@company.com',
          full_name: 'Jane Smith',
          role: 'manager',
          status: 'active',
          department: 'HR',
          last_active: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString()
        },
        {
          id: '3',
          user_id: 'user-3',
          email: 'bob.wilson@company.com',
          full_name: 'Bob Wilson',
          role: 'user',
          status: 'pending',
          department: 'Marketing',
          last_active: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
        }
      ]
      
      setUsers(mockUsers)
      logger.info('Enterprise users loaded', { count: mockUsers.length })
    } catch (error) {
      logger.error('Failed to load enterprise users', error as Error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleUpdateUser = async (userId: string, updates: Partial<EnterpriseUser>) => {
    try {
      // In real implementation, update via Supabase
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      ))
      
      toast.success('User updated successfully')
      logger.info('User updated', { userId, updates })
    } catch (error) {
      logger.error('Failed to update user', error as Error)
      toast.error('Failed to update user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      setUsers(prev => prev.filter(user => user.id !== userId))
      toast.success('User deleted successfully')
      logger.info('User deleted', { userId })
    } catch (error) {
      logger.error('Failed to delete user', error as Error)
      toast.error('Failed to delete user')
    }
  }

  const handleInviteUser = async (email: string, role: string, department: string) => {
    try {
      // Mock user invitation
      const newUser: EnterpriseUser = {
        id: `user-${Date.now()}`,
        user_id: `pending-${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        role: role as any,
        status: 'pending',
        department,
        last_active: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
      
      setUsers(prev => [...prev, newUser])
      toast.success('User invitation sent')
      logger.info('User invited', { email, role, department })
    } catch (error) {
      logger.error('Failed to invite user', error as Error)
      toast.error('Failed to send invitation')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      suspended: 'destructive',
      pending: 'secondary'
    } as const
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'destructive',
      manager: 'default',
      user: 'secondary'
    } as const
    
    return <Badge variant={variants[role as keyof typeof variants]}>{role}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              User Management
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleInviteUser(
                    formData.get('email') as string,
                    formData.get('role') as string,
                    formData.get('department') as string
                  )
                  e.currentTarget.reset()
                }}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input name="email" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select name="role" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input name="department" required />
                    </div>
                    <Button type="submit" className="w-full">
                      Send Invitation
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.full_name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    {new Date(user.last_active).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleUpdateUser(selectedUser.id, {
                role: formData.get('role') as any,
                status: formData.get('status') as any,
                department: formData.get('department') as string
              })
              setIsEditDialogOpen(false)
            }}>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input value={selectedUser.email} disabled />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" defaultValue={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={selectedUser.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input name="department" defaultValue={selectedUser.department} />
                </div>
                <Button type="submit" className="w-full">
                  Update User
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}