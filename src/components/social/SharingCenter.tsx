
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Share2, Download, Copy, Twitter, Facebook, Instagram, Link } from 'lucide-react';
import { toast } from 'sonner';

interface ShareableAchievement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  shareText: string;
}

export const SharingCenter: React.FC = () => {
  const [customMessage, setCustomMessage] = useState('');

  const achievements: ShareableAchievement[] = [
    {
      id: '1',
      title: '30-Day Meditation Streak',
      description: 'Completed 30 consecutive days of meditation',
      imageUrl: '/placeholder.svg',
      shareText: 'Just completed a 30-day meditation streak! 🧘‍♀️ #MindfulMoments #WellnessJourney'
    },
    {
      id: '2',
      title: 'Focus Champion',
      description: 'Mastered the art of deep focus with 50+ sessions',
      imageUrl: '/placeholder.svg',
      shareText: 'Achieved Focus Champion status! 🎯 50+ deep focus sessions completed. #ProductivityWins #FocusMode'
    },
    {
      id: '3',
      title: 'Zen Master Level',
      description: 'Reached expert level in meditation practice',
      imageUrl: '/placeholder.svg',
      shareText: 'Proud to announce I\'ve reached Zen Master level! 🏆 #ZenMaster #MeditationJourney'
    }
  ];

  const shareToSocial = (platform: string, achievement: ShareableAchievement) => {
    const text = customMessage || achievement.shareText;
    const url = window.location.origin;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(`${text} ${url}`);
        toast.success('Content copied to clipboard! Share it on Instagram.');
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = (achievement: ShareableAchievement) => {
    const text = customMessage || achievement.shareText;
    const url = window.location.origin;
    navigator.clipboard.writeText(`${text} ${url}`);
    toast.success('Link copied to clipboard!');
  };

  const downloadImage = (achievement: ShareableAchievement) => {
    // In a real app, this would generate and download an image
    toast.success('Achievement image downloaded!');
  };

  const generateShareableLink = (achievement: ShareableAchievement) => {
    const shareUrl = `${window.location.origin}/achievement/${achievement.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Shareable link copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sharing Center</h2>
        <p className="text-muted-foreground">Share your achievements and inspire others</p>
      </div>

      {/* Custom Message */}
      <Card>
        <CardHeader>
          <CardTitle>Customize Your Message</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Add your personal message to share with achievements..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Leave empty to use default messages
          </p>
        </CardContent>
      </Card>

      {/* Shareable Achievements */}
      <div className="grid gap-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                </div>
                <Badge variant="outline">Ready to Share</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <p className="text-sm italic">
                  {customMessage || achievement.shareText}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareToSocial('twitter', achievement)}
                  className="flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareToSocial('facebook', achievement)}
                  className="flex items-center gap-2"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareToSocial('instagram', achievement)}
                  className="flex items-center gap-2"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(achievement)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadImage(achievement)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Image
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateShareableLink(achievement)}
                  className="flex items-center gap-2"
                >
                  <Link className="h-4 w-4" />
                  Link
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Share Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">127</div>
              <div className="text-xs text-muted-foreground">Meditation Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">23</div>
              <div className="text-xs text-muted-foreground">Focus Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">8</div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
