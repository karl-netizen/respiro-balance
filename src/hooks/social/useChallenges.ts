
import { useState, useEffect } from 'react';
import { useSocialApi } from './useSocialApi';
import type { CommunityChallenge } from '@/types/social';

export function useChallenges() {
  const { fetchChallenges, joinChallenge, isLoading } = useSocialApi();
  const [challenges, setChallenges] = useState<{
    active: CommunityChallenge[];
    available: CommunityChallenge[];
    completed: CommunityChallenge[];
  }>({
    active: [],
    available: [],
    completed: []
  });

  const loadChallenges = async () => {
    try {
      const [active, available, completed] = await Promise.all([
        fetchChallenges('active'),
        fetchChallenges('upcoming'),
        fetchChallenges('completed')
      ]);

      setChallenges({
        active,
        available,
        completed
      });
    } catch (error) {
      console.error('Failed to load challenges:', error);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    const success = await joinChallenge(challengeId);
    
    if (success) {
      // Move challenge from available to active
      setChallenges(prev => {
        const challenge = prev.available.find(c => c.id === challengeId);
        if (challenge) {
          return {
            ...prev,
            available: prev.available.filter(c => c.id !== challengeId),
            active: [...prev.active, { ...challenge, user_participation: { status: 'active' } as any }]
          };
        }
        return prev;
      });
    }
    
    return success;
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  return {
    challenges,
    isLoading,
    joinChallenge: handleJoinChallenge,
    refreshChallenges: loadChallenges,
  };
}
