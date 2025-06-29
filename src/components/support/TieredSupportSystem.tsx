
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, Video, Mail, Search, Clock, User, CheckCircle } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  responses: Array<{
    from: 'user' | 'support' | 'expert';
    message: string;
    timestamp: Date;
  }>;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}

export const TieredSupportSystem: React.FC = () => {
  const { currentTier } = useFeatureAccess();
  const [activeTab, setActiveTab] = useState<'help' | 'contact' | 'tickets'>('help');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I start my first meditation session?',
      answer: 'Navigate to the meditation page, choose a beginner-friendly session, and click play. We recommend starting with our "Breathing Basics" 5-minute session.',
      category: 'Getting Started',
      helpful: 45,
      notHelpful: 2
    },
    {
      id: '2',
      question: 'What\'s the difference between Premium and Premium Pro?',
      answer: 'Premium includes unlimited sessions and basic analytics. Premium Pro adds biofeedback integration, group challenges, and advanced sleep stories.',
      category: 'Subscriptions',
      helpful: 38,
      notHelpful: 1
    },
    {
      id: '3',
      question: 'Can I use the app offline?',
      answer: 'Yes! Premium users can download sessions for offline use. Go to any session and tap the download icon.',
      category: 'Features',
      helpful: 52,
      notHelpful: 0
    },
    {
      id: '4',
      question: 'How do I connect my fitness tracker?',
      answer: 'Premium Pro users can connect wearables in Settings > Biofeedback > Device Connection. We support Apple Watch, Fitbit, and Garmin.',
      category: 'Premium Features',
      helpful: 29,
      notHelpful: 3
    }
  ];

  const [tickets] = useState<SupportTicket[]>([
    {
      id: 'TICK-001',
      subject: 'Biofeedback not syncing with Apple Watch',
      message: 'My Apple Watch data isn\'t showing up in the app...',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      responses: [
        {
          from: 'support',
          message: 'Thanks for reaching out! We\'re looking into the Apple Watch sync issue. Can you please check if you\'ve granted health permissions?',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]
    }
  ]);

  const getSupportFeatures = () => {
    switch (currentTier) {
      case 'premium_plus':
        return {
          responseTime: '1 hour',
          features: ['Live Chat', 'Video Calls', 'Expert Consultation', 'Priority Support'],
          badge: 'Premium Plus',
          color: 'purple'
        };
      case 'premium_pro':
        return {
          responseTime: '4 hours',
          features: ['Live Chat', 'Email Support', 'Phone Support'],
          badge: 'Premium Pro',
          color: 'blue'
        };
      case 'premium':
        return {
          responseTime: '24 hours',
          features: ['Email Support', 'Knowledge Base'],
          badge: 'Premium',
          color: 'green'
        };
      default:
        return {
          responseTime: '48 hours',
          features: ['Knowledge Base', 'Community Forum'],
          badge: 'Free',
          color: 'gray'
        };
    }
  };

  const supportFeatures = getSupportFeatures();

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = () => {
    if (!newTicket.subject || !newTicket.message) return;
    
    console.log('New ticket submitted:', newTicket);
    // Reset form
    setNewTicket({ subject: '', message: '', priority: 'medium' });
    // Would normally submit to backend
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Support Center</h2>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className={`border-${supportFeatures.color}-500`}>
            {supportFeatures.badge}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Average response time: {supportFeatures.responseTime}
          </span>
        </div>
      </div>

      {/* Support Features */}
      <Card>
        <CardHeader>
          <CardTitle>Your Support Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {supportFeatures.features.map((feature, index) => {
              const icons = {
                'Live Chat': <MessageCircle className="w-6 h-6" />,
                'Video Calls': <Video className="w-6 h-6" />,
                'Phone Support': <Phone className="w-6 h-6" />,
                'Email Support': <Mail className="w-6 h-6" />,
                'Expert Consultation': <User className="w-6 h-6" />,
                'Priority Support': <Clock className="w-6 h-6" />,
                'Knowledge Base': <Search className="w-6 h-6" />,
                'Community Forum': <MessageCircle className="w-6 h-6" />
              };

              return (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <div className="flex justify-center mb-2 text-blue-600">
                    {icons[feature as keyof typeof icons]}
                  </div>
                  <div className="text-sm font-medium">{feature}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {[
          { id: 'help', label: 'Help Center', icon: <Search className="w-4 h-4" /> },
          { id: 'contact', label: 'Contact Support', icon: <MessageCircle className="w-4 h-4" /> },
          { id: 'tickets', label: 'My Tickets', icon: <Mail className="w-4 h-4" /> }
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id as any)}
            className="flex-1 flex items-center gap-2"
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Help Center */}
      {activeTab === 'help' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* FAQ Categories */}
          <div className="grid gap-4">
            {['Getting Started', 'Subscriptions', 'Features', 'Premium Features'].map(category => {
              const categoryFAQs = filteredFAQs.filter(faq => faq.category === category);
              if (categoryFAQs.length === 0) return null;

              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoryFAQs.map(faq => (
                      <div key={faq.id} className="border-b pb-4 last:border-b-0">
                        <h3 className="font-medium mb-2">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{faq.answer}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Was this helpful?</span>
                          <button className="flex items-center gap-1 hover:text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            Yes ({faq.helpful})
                          </button>
                          <button className="flex items-center gap-1 hover:text-red-600">
                            <X className="w-3 h-3" />
                            No ({faq.notHelpful})
                          </button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Contact Support */}
      {activeTab === 'contact' && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                placeholder="Brief description of your issue"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                className="w-full p-2 border rounded-md"
              >
                <option value="low">Low - General question</option>
                <option value="medium">Medium - Feature issue</option>
                <option value="high">High - Cannot use app</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                placeholder="Please describe your issue in detail..."
                rows={5}
              />
            </div>

            <Button onClick={handleSubmitTicket} className="w-full">
              Submit Ticket
            </Button>

            {currentTier === 'premium_plus' && (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">Premium Plus Support</h3>
                <p className="text-sm text-purple-700 mb-3">
                  Need immediate help? Schedule a video call with our meditation experts.
                </p>
                <Button variant="outline" className="border-purple-500 text-purple-700">
                  <Video className="w-4 h-4 mr-2" />
                  Schedule Expert Call
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* My Tickets */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Support Tickets</h3>
                <p className="text-sm text-muted-foreground">
                  You haven't submitted any support tickets yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            tickets.map(ticket => (
              <Card key={ticket.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Ticket #{ticket.id} • Created {ticket.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={
                        ticket.status === 'resolved' ? 'default' :
                        ticket.status === 'in_progress' ? 'secondary' : 'outline'
                      }>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant={
                        ticket.priority === 'high' ? 'destructive' :
                        ticket.priority === 'medium' ? 'secondary' : 'outline'
                      }>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">{ticket.message}</p>
                    
                    {ticket.responses.map((response, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg ${
                          response.from === 'user' ? 'bg-blue-50 ml-8' : 'bg-green-50 mr-8'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                            {response.from === 'user' ? 'You' : 
                             response.from === 'expert' ? 'Expert' : 'Support Team'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {response.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{response.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
