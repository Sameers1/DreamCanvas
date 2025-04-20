import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    async function handleAuthCallback() {
      console.log('Auth callback component mounted');
      try {
        const url = window.location.href;
        console.log('Current URL:', url);
        
        // Get the auth code from the URL
        const code = new URL(url).searchParams.get('code');
        console.log('Auth code present:', !!code);
        
        if (!code) {
          console.error('No code found in URL');
          setLocation('/');
          return;
        }

        console.log('Attempting to exchange code for session...');
        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          console.error('Error exchanging code for session:', error);
          setLocation('/');
          return;
        }

        console.log('Session established:', !!data.session);
        // Redirect to home page after successful sign in
        setLocation('/');
      } catch (error) {
        console.error('Error in auth callback:', error);
        setLocation('/');
      }
    }

    handleAuthCallback();
  }, [setLocation]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Completing sign in...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
} 