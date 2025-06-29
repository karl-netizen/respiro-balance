
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Share2, 
  Copy, 
  Mail, 
  MessageSquare, 
  Users, 
  Gift, 
  Trophy,
  Star,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface ReferralSystemProps {
  userCode: string;
  referralStats: {
    totalReferrals: number;
    successfulReferrals: number;
    pendingReferrals: number;
    totalRewards: number;
  };
}

export const ReferralSystem: React.FC<ReferralSystemProps> = ({
  userCode,
  referralStats
}) => {
  const [email, setEmail] = useState('');
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);

  const referralUrl = `https://respirobalance.com/signup?ref=${userCode}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const addEmail = () => {
    if (email && !inviteEmails.includes(email)) {
      setInviteEmails([...inviteEmails, email]);
      setEmail('');
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setInviteEmails(inviteEmails.filter(e => e !== emailToRemove));
  };

  const sendInvites = () => {
    // Implementation for sending invites
    toast.success(`Invites sent to ${inviteEmails.length} friends!`);
    setInviteEmails([]);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{referralStats.totalReferrals}</div>
            <div className="text-sm text-gray-600">Total Referrals</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{referralStats.successfulReferrals}</div>
            <div className="text-sm text-gray-600">Successful</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{referralStats.pendingReferrals}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">${referralStats.totalRewards}</div>
            <div className="text-sm text-gray-600">Rewards Earned</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invite" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invite">Invite Friends</TabsTrigger>
          <TabsTrigger value="share">Share & Earn</TabsTrigger>
          <TabsTrigger value="family">Family Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="invite" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Invite by Email</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter friend's email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                />
                <Button onClick={addEmail}>Add</Button>
              </div>

              {inviteEmails.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Invites to send:</div>
                  <div className="flex flex-wrap gap-2">
                    {inviteEmails.map((email) => (
                      <Badge key={email} variant="secondary" className="cursor-pointer">
                        {email}
                        <button
                          onClick={() => removeEmail(email)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Button onClick={sendInvites} className="w-full">
                    Send {inviteEmails.length} Invite{inviteEmails.length > 1 ? 's' : ''}
                  </Button>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Gift className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">Referral Rewards</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• You get 1 month free for each successful referral</li>
                  <li>• Your friend gets 50% off their first month</li>
                  <li>• Bonus: Refer 5 friends, get Premium Plus for free!</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share Your Link</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-2">Your referral code:</div>
                <div className="flex space-x-2">
                  <Input value={userCode} readOnly />
                  <Button onClick={() => copyToClipboard(userCode)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-2">Your referral link:</div>
                <div className="flex space-x-2">
                  <Input value={referralUrl} readOnly className="text-xs" />
                  <Button onClick={() => copyToClipboard(referralUrl)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const text = `Check out Respiro Balance - the meditation app that's transforming my daily routine! Use my link for 50% off: ${referralUrl}`;
                    copyToClipboard(text);
                  }}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <MessageSquare className="w-6 h-6" />
                  <span>Copy Message</span>
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    const subject = 'Try Respiro Balance with me!';
                    const body = `I've been using Respiro Balance for meditation and it's amazing! Join me and get 50% off your first month: ${referralUrl}`;
                    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                  }}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                >
                  <Mail className="w-6 h-6" />
                  <span>Email Link</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Family Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Gift className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Family Plan Benefits</span>
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Up to 6 family members</li>
                  <li>• Individual progress tracking</li>
                  <li>• Shared family challenges</li>
                  <li>• 40% savings compared to individual plans</li>
                </ul>
              </div>

              <div className="text-center space-y-4">
                <div>
                  <div className="text-3xl font-bold">$29.97/month</div>
                  <div className="text-sm text-gray-600">For up to 6 family members</div>
                  <div className="text-sm text-green-600">Save $42/month vs individual plans</div>
                </div>
                
                <Button className="w-full">
                  Upgrade to Family Plan
                </Button>
                
                <div className="text-xs text-gray-500">
                  Family members will receive an invitation to join your plan
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
