import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback to hardcoded values
const supabaseUrl = process.env.SUPABASE_URL || 'https://xocawdbmzzukfwfvawwm.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvY2F3ZGJtenp1a2Z3ZnZhd3dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTY5MDUsImV4cCI6MjA2MDU3MjkwNX0.gtPDCOK5Zv1U_ihbTDprv_-i7ULsJV4JLKba9c6tGZQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 