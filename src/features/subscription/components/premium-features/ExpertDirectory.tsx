
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Clock, Globe, Award, Calendar } from 'lucide-react';
import { Expert } from '@/types/experts';
import { FeatureGate } from '../management/FeatureGate';

interface ExpertDirectoryProps {
  onBookSession: (expert: Expert) => void;
}

const ExpertDirectory: React.FC<ExpertDirectoryProps> = ({ onBookSession }) => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockExperts: Expert[] = [
      {
        id: '1',
        name: 'Dr. Sarah Chen',
        email: 'sarah.chen@respirobalance.com',
        avatar_url: '/api/placeholder/150/150',
        bio: 'Certified meditation instructor with 15+ years of experience in mindfulness and stress reduction.',
        specializations: ['Stress Management', 'Mindfulness', 'Anxiety Relief'],
        certifications: ['Certified Mindfulness Instructor', 'PhD in Psychology'],
        years_experience: 15,
        rating: 4.9,
        total_sessions: 1247,
        hourly_rate: 150,
        languages: ['English', 'Mandarin'],
        timezone: 'PST',
        availability: [],
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      },
      {
        id: '2',
        name: 'Marcus Johnson',
        email: 'marcus.johnson@respirobalance.com',
        avatar_url: '/api/placeholder/150/150',
        bio: 'Former Navy SEAL turned meditation expert, specializing in performance enhancement and focus training.',
        specializations: ['Performance Enhancement', 'Focus Training', 'Sleep Optimization'],
        certifications: ['Certified Performance Coach', 'Sleep Specialist'],
        years_experience: 8,
        rating: 4.8,
        total_sessions: 892,
        hourly_rate: 175,
        languages: ['English'],
        timezone: 'EST',
        availability: [],
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ];
    
    setTimeout(() => {
      setExperts(mockExperts);
      setLoading(false);
    }, 1000);
  }, []);

  const specializations = ['all', 'Stress Management', 'Mindfulness', 'Anxiety Relief', 'Performance Enhancement', 'Focus Training', 'Sleep Optimization'];

  const filteredExperts = selectedSpecialization === 'all' 
    ? experts 
    : experts.filter(expert => expert.specializations.includes(selectedSpecialization));

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <FeatureGate
      requiredTier="premium"
      featureName="1-on-1 Expert Sessions"
      featureDescription="Connect with certified meditation experts for personalized guidance"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Expert Directory</h2>
            <p className="text-muted-foreground">Connect with certified meditation experts</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {specializations.map((spec) => (
              <Button
                key={spec}
                variant={selectedSpecialization === spec ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSpecialization(spec)}
                className="capitalize"
              >
                {spec === 'all' ? 'All Experts' : spec}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {filteredExperts.map((expert) => (
            <Card key={expert.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={expert.avatar_url} alt={expert.name} />
                    <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold">{expert.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{expert.rating}</span>
                          <span>({expert.total_sessions} sessions)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{expert.years_experience} years</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <span>{expert.timezone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">{expert.bio}</p>
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {expert.specializations.map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {expert.certifications.map((cert) => (
                          <Badge key={cert} variant="outline" className="text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm">
                        <span className="font-semibold">${expert.hourly_rate}/hour</span>
                        <span className="text-muted-foreground ml-2">
                          Languages: {expert.languages.join(', ')}
                        </span>
                      </div>
                      
                      <Button onClick={() => onBookSession(expert)} className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Book Session</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredExperts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">No experts found</h3>
              <p className="text-muted-foreground">
                Try adjusting your specialization filter or check back later.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </FeatureGate>
  );
};

export default ExpertDirectory;
