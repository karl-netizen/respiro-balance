
import { useState, useEffect } from "react";
import { useUserPreferences } from "@/context";
import { MorningRitual, RitualStatus } from "@/context/types";
import { toast } from "sonner";
import { wasCompletedToday } from "../utils";
import { filterRituals, getAllAvailableTags, defaultFilters } from "../filterUtils";
import { RitualFilters } from "../RitualFilter";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const useRitualTimeline = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { user } = useAuth();
  const rituals = preferences.morningRituals || [];
  const [filters, setFilters] = useState<RitualFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialization effect
  useEffect(() => {
    const fetchRituals = async () => {
      setIsLoading(true);
      
      try {
        // If user is authenticated and Supabase is configured, fetch rituals from preferences
        if (user && isSupabaseConfigured()) {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('preferences_data')
            .eq('user_id', user.id)
            .single();
            
          if (error) {
            console.error("Error fetching rituals from Supabase:", error);
            // If there's an error, we'll fall back to the local preferences
          } else if (data && data.preferences_data?.morningRituals) {
            // If we successfully got rituals from Supabase, update preferences
            updatePreferences({
              morningRituals: data.preferences_data.morningRituals
            });
          }
        }
      } catch (error) {
        console.error("Failed to load rituals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRituals();
  }, [user, updatePreferences]);
  
  // Get all available tags from rituals
  const availableTags = getAllAvailableTags(rituals);
  
  // Apply filters to rituals
  const filteredRituals = filterRituals(rituals, filters);
  
  // Sort rituals by time of day
  const sortedRituals = [...filteredRituals].sort((a, b) => {
    const timeA = a.timeOfDay.split(':').map(Number);
    const timeB = b.timeOfDay.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });
  
  const completeRitual = (ritualId: string) => {
    const updatedRituals = rituals.map(ritual => {
      if (ritual.id === ritualId) {
        const isCompletedToday = ritual.status === "completed" && wasCompletedToday(ritual.lastCompleted);
        
        if (isCompletedToday) {
          // If already completed today, mark as planned again
          return { 
            ...ritual, 
            status: "planned" as RitualStatus,
            lastCompleted: undefined,
            streak: Math.max(0, ritual.streak - 1)
          };
        } else {
          // Mark as completed
          return { 
            ...ritual, 
            status: "completed" as RitualStatus,
            lastCompleted: new Date().toISOString(),
            streak: ritual.streak + 1
          };
        }
      }
      return ritual;
    });
    
    updatePreferences({ morningRituals: updatedRituals });
    
    // Save to Supabase if user is authenticated
    if (user && isSupabaseConfigured()) {
      saveRitualsToSupabase(updatedRituals, user.id);
    }
    
    // Show appropriate toast message
    const ritual = rituals.find(r => r.id === ritualId);
    const isCompleting = !(ritual?.status === "completed" && wasCompletedToday(ritual?.lastCompleted));
    
    toast(isCompleting ? "Ritual completed" : "Ritual status updated", {
      description: isCompleting ? 
        "Great job! Keep up your morning routine." : 
        "Your morning ritual status has been updated",
    });
  };
  
  const deleteRitual = (ritualId: string) => {
    const updatedRituals = rituals.filter(ritual => ritual.id !== ritualId);
    updatePreferences({ morningRituals: updatedRituals });
    
    // Save to Supabase if user is authenticated
    if (user && isSupabaseConfigured()) {
      saveRitualsToSupabase(updatedRituals, user.id);
    }
    
    toast("Ritual deleted", {
      description: "Your morning ritual has been removed",
    });
  };
  
  const updateRitual = (updatedRitual: MorningRitual) => {
    const updatedRituals = rituals.map(ritual => 
      ritual.id === updatedRitual.id ? updatedRitual : ritual
    );
    
    updatePreferences({ morningRituals: updatedRituals });
    
    // Save to Supabase if user is authenticated
    if (user && isSupabaseConfigured()) {
      saveRitualsToSupabase(updatedRituals, user.id);
    }
    
    toast("Ritual updated", {
      description: "Your morning ritual has been updated",
    });
  };
  
  const saveRitualsToSupabase = async (rituals: MorningRitual[], userId: string) => {
    try {
      // Get the current user preferences
      const { data: prefsData } = await supabase
        .from('user_preferences')
        .select('id, preferences_data')
        .eq('user_id', userId)
        .single();
        
      if (prefsData) {
        // Update preferences with latest rituals
        const updatedData = {
          ...prefsData.preferences_data,
          morningRituals: rituals
        };
        
        await supabase
          .from('user_preferences')
          .update({ 
            preferences_data: updatedData,
            updated_at: new Date().toISOString()
          })
          .eq('id', prefsData.id);
      } else {
        // Create new preferences if they don't exist
        await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            preferences_data: { morningRituals: rituals },
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error("Failed to save rituals to Supabase:", error);
    }
  };
  
  const handleFilterChange = (newFilters: RitualFilters) => {
    setFilters(newFilters);
  };
  
  const resetFilters = () => {
    setFilters(defaultFilters);
  };
  
  return {
    rituals,
    sortedRituals,
    filters,
    availableTags,
    completeRitual,
    deleteRitual,
    updateRitual,
    handleFilterChange,
    resetFilters,
    isLoading
  };
};
