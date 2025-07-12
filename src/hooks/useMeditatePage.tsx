
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MeditationSession } from '@/types/meditation';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { useMeditationNavigation } from './meditation/useMeditationNavigation';
import { useMeditationFavorites } from './meditation/useMeditationFavorites';
import { useMeditationRecentlyPlayed } from './meditation/useMeditationRecentlyPlayed';

export const useMeditatePage = () => {
  console.log('🚀 useMeditatePage hook called!');
  const navigate = useNavigate();
  const { isPremium } = useSubscriptionContext();
  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log('💾 Current meditation sessions state:', meditationSessions.length);
  
  // Use extracted hooks
  const navigation = useMeditationNavigation();
  const favorites = useMeditationFavorites();
  const recentlyPlayed = useMeditationRecentlyPlayed();

  // Fetch meditation content from database
  useEffect(() => {
    const testBasicConnection = async () => {
      console.log('🔗 STEP 1: Testing basic Supabase connection...');
      try {
        // Test 1: Basic connection
        const { data: testData, error: testError } = await supabase
          .from('meditation_content')
          .select('count')
          .limit(1);
        console.log('🔗 Basic connection test:', { testData, testError });

        // Test 2: Check if table exists and has data
        const { data: countData, error: countError } = await supabase
          .from('meditation_content')
          .select('*', { count: 'exact', head: true });
        console.log('📊 Table existence & count test:', { countData, countError });

        // Test 3: Simple query without filters (should work with RLS)
        const { data: simpleData, error: simpleError } = await supabase
          .from('meditation_content')
          .select('id, title, category')
          .limit(3);
        console.log('🎯 Simple query test (no filters):', { simpleData, simpleError });

        // Test 4: Query with is_active filter (tests RLS policy)
        const { data: activeData, error: activeError } = await supabase
          .from('meditation_content')
          .select('id, title, category')
          .eq('is_active', true)
          .limit(3);
        console.log('🔒 RLS filtered query test:', { activeData, activeError });

      } catch (connectionError) {
        console.error('💥 Connection test exception:', connectionError);
      }
    };

    const fetchMeditationContent = async () => {
      console.log('🎯 STEP 2: Starting full meditation content fetch...');
      
      // First run connection tests
      await testBasicConnection();
      
      try {
        console.log('🔗 Checking Supabase client availability:', !!supabase);
        console.log('🔒 Checking auth state:', await supabase.auth.getUser());
        
        const { data, error } = await supabase
          .from('meditation_content')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        console.log('📊 FULL QUERY RESULT:', { 
          data, 
          error, 
          count: data?.length,
          hasSupabase: !!supabase,
          queryExecuted: true 
        });

        if (error) {
          console.error('❌ Supabase error fetching meditation content:', error);
          return;
        }

        if (!data || data.length === 0) {
          console.warn('⚠️ No meditation content found in database');
          return;
        }

        // Transform database content to MeditationSession format
        const sessions: MeditationSession[] = data.map(content => ({
          id: content.id,
          title: content.title,
          category: content.category,
          difficulty: content.difficulty_level || 'Beginner',
          duration: content.duration,
          instructor: content.instructor || 'Unknown',
          description: content.description || '',
          image_url: content.thumbnail_url || '/placeholder.svg',
          tags: content.tags || [],
          premium: content.subscription_tier !== 'free',
          audio_url: content.audio_file_url,
          session_type: 'guided',
          level: content.difficulty_level || 'beginner'
        }));
        
        console.log('🔥 MEDITATION DEBUG - Data fetched:', data.length, 'items');
        console.log('🔥 MEDITATION DEBUG - Sessions created:', sessions.length, 'sessions');
        
        if (sessions.length === 0) {
          console.log('🚨 NO SESSIONS CREATED - Raw data:', data);
        } else {
          console.log('✅ Sessions sample:', sessions.slice(0, 2));
        }
        setMeditationSessions(sessions);
      } catch (error) {
        console.error('💥 Exception in fetchMeditationContent:', error);
      } finally {
        console.log('🏁 Fetch completed, setting loading to false');
        setIsLoading(false);
      }
    };

    fetchMeditationContent();
  }, []);

  // Get all meditation sessions available in the system
  const getAllSessions = useCallback((): MeditationSession[] => {
    console.log('📋 getAllSessions called, returning:', meditationSessions.length, 'sessions');
    return meditationSessions;
  }, [meditationSessions]);

  // COMPREHENSIVE CATEGORY MAPPING SYSTEM
  const CATEGORY_MAPPING = {
    'guided': ['Mindfulness', 'Loving Kindness', 'Body Scan', 'Breathing'],
    'quick': ['Focus', 'Energy'], 
    'deep': ['Stress Relief'],
    'sleep': ['Sleep']
  };

  // Get sessions for a specific category with comprehensive debugging
  const getFilteredSessions = useCallback((category: string): MeditationSession[] => {
    console.log(`🔍 FILTERING DEBUG: UI category '${category}', total sessions: ${meditationSessions.length}`);
    
    if (category === 'all') {
      console.log(`📂 Returning all ${meditationSessions.length} sessions`);
      return meditationSessions;
    } 
    
    if (category === 'favorites') {
      const favs = meditationSessions.filter(s => favorites.favoriteSessions.includes(s.id));
      console.log(`❤️ Found ${favs.length} favorite sessions`);
      return favs;
    }
    
    // Use category mapping
    const mappedCategories = CATEGORY_MAPPING[category] || [];
    console.log(`🗺️ Mapped categories for '${category}':`, mappedCategories);
    
    if (mappedCategories.length === 0) {
      console.log(`⚠️ No mapping found for '${category}', trying direct match fallback`);
      const directMatch = meditationSessions.filter(s => 
        s?.category?.toLowerCase().includes(category.toLowerCase())
      );
      console.log(`📂 Direct match fallback result: ${directMatch.length} sessions`);
      return directMatch;
    }
    
    const filtered = meditationSessions.filter(s => 
      mappedCategories.includes(s?.category)
    );
    
    console.log(`📂 Filtered sessions for '${category}': ${filtered.length}`);
    console.log(`📝 Sample filtered session:`, filtered[0] || 'None found');
    console.log(`🏷️ Available categories in all sessions:`, [...new Set(meditationSessions.map(s => s.category))]);
    
    return filtered;
  }, [meditationSessions, favorites.favoriteSessions]);
  
  const getFavoriteSessions = useCallback((): MeditationSession[] => {
    return meditationSessions.filter(s => favorites.favoriteSessions.includes(s.id));
  }, [meditationSessions, favorites.favoriteSessions]);

  const handleStartMeditation = useCallback((session: MeditationSession) => {
    // Check if session is premium and user doesn't have premium
    if (session.premium && !isPremium) {
      toast.error("This is a premium session", {
        description: "Upgrade your subscription to access premium content",
        action: {
          label: "Upgrade",
          onClick: () => navigate('/subscription')
        }
      });
      return;
    }
    
    // Add to recently played
    recentlyPlayed.addToRecentlyPlayed(session);
    
    // Start the session
    navigation.handleStartMeditation(session);
  }, [isPremium, navigate, recentlyPlayed, navigation]);

  return {
    ...navigation,
    ...favorites,
    ...recentlyPlayed,
    getAllSessions,
    getFilteredSessions,
    getFavoriteSessions,
    handleStartMeditation,
    isPremium
  };
};
