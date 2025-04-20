import { createClient } from '@supabase/supabase-js';

// Log environment variables (excluding sensitive values)
console.log('VITE_SUPABASE_URL is set:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY is set:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

if (!import.meta.env.VITE_SUPABASE_URL) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
  throw new Error('Missing Supabase URL configuration');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
  throw new Error('Missing Supabase anon key configuration');
}

// Validate URL format
try {
  new URL(import.meta.env.VITE_SUPABASE_URL);
} catch (error) {
  console.error('Invalid VITE_SUPABASE_URL format:', error);
  throw new Error('Invalid Supabase URL format');
}

const SITE_URL = import.meta.env.PROD 
  ? 'https://dreamcanvas.netlify.app'
  : 'http://localhost:5173';

const API_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || '/.netlify/functions'
  : 'http://localhost:3000';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: window.localStorage,
      storageKey: 'supabase-auth'
    },
    global: {
      headers: {
        'x-application-name': 'dreamcanvas'
      }
    }
  }
);

// Auth helper functions
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${SITE_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });
  console.log('Redirect URL:', `${SITE_URL}/auth/callback`);
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Auth state change listener
export const onAuthStateChange = (callback: (event: any, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Export SITE_URL for use in other components
export { SITE_URL }; 