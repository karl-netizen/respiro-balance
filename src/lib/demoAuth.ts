
import { Session, User } from '@supabase/supabase-js';

// Demo user and session for development without Supabase credentials
export const DEMO_USER: User = {
  id: 'demo-user-id',
  app_metadata: {},
  user_metadata: { first_name: 'Demo' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'demo@example.com',
  role: 'authenticated',
};

export const DEMO_SESSION: Session = {
  access_token: 'demo-access-token',
  token_type: 'bearer',
  refresh_token: 'demo-refresh-token',
  expires_in: 3600,
  expires_at: new Date().getTime() + 3600000,
  user: DEMO_USER,
};
