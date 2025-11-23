import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  last_login: string;
  total_sessions: number;
  total_time_spent: number; // in seconds
}

export interface ActivityLog {
  id: string;
  user_id: string;
  session_start: string;
  session_end: string | null;
  time_spent: number; // in seconds
  page_visits: Record<string, number>;
  created_at: string;
}

export interface DailyStats {
  user_id: string;
  date: string;
  total_time: number; // in seconds
  sessions_count: number;
  pages_visited: string[];
}

