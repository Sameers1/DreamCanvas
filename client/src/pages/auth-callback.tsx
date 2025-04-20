import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        // Get the auth code from the URL
        const code = new URL(window.location.href).searchParams.get('code');
        
        if (!code) {
          console.error('No code found in URL');
          setLocation('/');
          return;
        }

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          console.error('Error exchanging code for session:', error);
          setLocation('/');
          return;
        }

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