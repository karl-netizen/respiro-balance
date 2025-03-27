
import { createContext } from 'react';
import { UserPreferencesContextType } from './types';

export const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);
