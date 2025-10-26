import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Phone, Mail, Bot, User, Star, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  category: string;
}

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
  isTyping?: boolean;
}

export const TieredSupportSystem: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: ''
  });

  const userTier = user?.subscription_tier || 'free';

  const supportFeatures = {
    free: {
      features: ['AI Chatbot', 'Knowledge Base', 'Community Forum'],
      responseTime: '24-48 hours',
      availability: 'Business hours',
      channels: ['chatbot', 'email']
    },
    premium: {
      features: ['Priority Support', 'Live Chat', 'Phone Support'],
      responseTime: '4-8 hours',
      availability: 'Extended hours',
      channels: ['chatbot', 'email', 'chat', 'phone']
    },
    'premium-plus': {
      features: ['Expert Support', 'Personal Account Manager', 'Video Calls'],
      responseTime: '1-2 hours',
      availability: '24/7',
      channels: ['chatbot', 'email', 'chat', 'phone', 'video']
    },
    'premium-pro': {
      features: ['Dedicated Support', 'Meditation Expert Access', 'Custom Solutions'],
      responseTime: '30 minutes',
      availability: '24/7 Priority',
      channels: ['chatbot', 'email', 'chat', 'phone', 'video', 'dedicated']
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I understand your question. Let me help you with that. Based on your query, here are some suggestions...",
        sender: 'bot',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleCreateTicket = async () => {
    if (!newTicket.title || !newTicket.description) return;

    const ticket: SupportTicket = {
      id: Date.now().toString(),
      title: newTicket.title,
      description: newTicket.description,
      priority: newTicket.priority,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      category: newTicket.category
    };

    setTickets(prev => [...prev, ticket]);
    setNewTicket({ title: '', description: '', priority: 'medium', category: '' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'default';
      case 'in-progress': return 'secondary';
      case 'open': return 'outline';
      case 'closed': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Support Center</h2>
        <Badge variant="outline" className="capitalize">
          {userTier} Support
        </Badge>
      </div>

      {/* Support Tier Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Support Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Available Features</h4>
              <ul className="space-y-1">
                {supportFeatures[userTier as keyof typeof supportFeatures]?.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">
                    Response Time: {supportFeatures[userTier as keyof typeof supportFeatures]?.responseTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">
                    Availability: {supportFeatures[userTier as keyof typeof supportFeatures]?.availability}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="contact">Contact Options</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                AI Support Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 h-64 overflow-y-auto">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                          <span className="text-xs opacity-75">
                            {msg.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start mb-2">
                      <div className="bg-muted text-foreground max-w-xs px-3 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4" />
                          <span className="text-xs">AI is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Ticket Title"
                value={newTicket.title}
                onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
              />
              <Textarea
                placeholder="Describe your issue..."
                value={newTicket.description}
                onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
              />
              <div className="flex gap-2">
                <Select value={newTicket.priority} onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={newTicket.category} onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="content">Content Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateTicket}>Create Ticket</Button>
            </CardContent>
          </Card>

          {/* Existing Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Your Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{ticket.title}</h4>
                      <div className="flex gap-2">
                        <Badge variant={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge variant={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                    <div className="text-xs text-muted-foreground">
                      Created: {ticket.createdAt.toLocaleString()}
                    </div>
                  </div>
                ))}
                {tickets.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No support tickets yet. Create one above if you need help.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Getting Started</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• How to create your first meditation session</li>
                    <li>• Setting up your meditation goals</li>
                    <li>• Understanding your progress dashboard</li>
                    <li>• Connecting biofeedback devices</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Troubleshooting</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Audio playback issues</li>
                    <li>• Syncing problems</li>
                    <li>• Account and subscription help</li>
                    <li>• Device compatibility</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Send us an email and we'll get back to you within {supportFeatures[userTier as keyof typeof supportFeatures]?.responseTime}.
                </p>
                <Button variant="outline" className="w-full">
                  support@respiro.com
                </Button>
              </CardContent>
            </Card>

            {userTier !== 'free' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Phone Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Call us directly for immediate assistance.
                  </p>
                  <Button variant="outline" className="w-full">
                    +1 (555) 123-4567
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
