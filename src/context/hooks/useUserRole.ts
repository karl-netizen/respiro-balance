
import { UserPreferences } from '../types';

export const useUserRole = (preferences: UserPreferences) => {
  const isCoach = () => {
    return preferences.userRole === "coach" || preferences.userRole === "admin";
  };

  return { isCoach };
};
