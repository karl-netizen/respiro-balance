
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Pause, 
  Gift, 
  ArrowLeft, 
  Heart, 
  DollarSign, 
  Calendar,
  Star,
  MessageCircle 
} from 'lucide-react';
import { PRICING } from '@/lib/pricing/constants';

interface RetentionFeaturesProps {
  type: 'cancellation' | 'pause' | 'winback' | 'loyalty';
  currentTier: string;
  onRetain: (offer: any) => void;
  onCancel: () => void;
}

export const RetentionFeatures: React.FC<RetentionFeaturesProps> = ({
  type,
  currentTier,
  onRetain,
  onCancel
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [feedback, setFeedback] = useState('');

  if (type === 'cancellation') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span>We're sorry to see you go</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Help us understand why you're leaving:</h3>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="too_expensive" id="too_expensive" />
                <Label htmlFor="too_expensive">Too expensive</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_using" id="not_using" />
                <Label htmlFor="not_using">Not using it enough</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="missing_features" id="missing_features" />
                <Label htmlFor="missing_features">Missing features I need</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="technical_issues" id="technical_issues" />
                <Label htmlFor="technical_issues">Technical issues</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="feedback">Additional feedback (optional)</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Help us improve..."
              className="mt-2"
            />
          </div>

          {selectedReason && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">
                Wait! We have a special offer for you
              </h4>
              
              <div className="space-y-3">
                {selectedReason === 'too_expensive' && (
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">50% Off Next 3 Months</div>
                        <div className="text-sm text-gray-600">Continue with {currentTier === 'premium' ? 'Premium' : 'Standard'} at just ${((currentTier === 'premium' ? PRICING.PREMIUM.monthly : PRICING.STANDARD.monthly) * 0.5).toFixed(2)}/month</div>
                      </div>
                      <Button onClick={() => onRetain({ type: 'discount', value: 50, duration: 3 })}>
                        Accept Offer
                      </Button>
                    </div>
                  </div>
                )}
                
                {selectedReason === 'not_using' && (
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Pause Your Subscription</div>
                        <div className="text-sm text-gray-600">Take a break for up to 3 months</div>
                      </div>
                      <Button onClick={() => onRetain({ type: 'pause', duration: 90 })}>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause Instead
                      </Button>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-lg p-3 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Personal Check-in</div>
                      <div className="text-sm text-gray-600">Let us help you get more value</div>
                    </div>
                    <Button variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Schedule Call
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={onCancel} className="flex-1">
              Continue Cancellation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'loyalty') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Loyalty Rewards</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">6 Months</div>
              <div className="text-sm text-gray-600">Free week added</div>
              <Badge variant="secondary" className="mt-2">Active</Badge>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <Gift className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold">12 Months</div>
              <div className="text-sm text-gray-600">Premium features unlock</div>
              <Badge variant="outline" className="mt-2">2 months to go</Badge>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="font-semibold">24 Months</div>
              <div className="text-sm text-gray-600">25% lifetime discount</div>
              <Badge variant="outline" className="mt-2">Coming soon</Badge>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Thank you for being loyal!</span>
            </div>
            <p className="text-sm text-green-700">
              You've been with us for 8 months. As a thank you, enjoy exclusive early access to new features and priority support.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Retention Feature</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Feature coming soon...</p>
      </CardContent>
    </Card>
  );
};
