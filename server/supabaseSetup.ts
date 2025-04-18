import { supabase } from './supabase';

async function setupTables() {
  try {
    console.log('Starting Supabase setup...');

    // Check if the tables exist first
    const { data: tablesData } = await supabase.from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    const existingTables = tablesData?.map(t => t.table_name) || [];
    
    // Create dreams table if it doesn't exist
    if (!existingTables.includes('dreams')) {
      console.log('Creating dreams table...');
      
      // Use SQL to create the table with appropriate types
      const { error: dreamsError } = await supabase.rpc('execute_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.dreams (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            image_url TEXT NOT NULL,
            style TEXT NOT NULL,
            mood TEXT NOT NULL,
            elements TEXT[] DEFAULT '{}',
            is_favorite BOOLEAN DEFAULT false,
            user_id INTEGER,
            created_at TEXT NOT NULL DEFAULT current_timestamp
          );
        `
      });
      
      if (dreamsError) {
        console.error('Error creating dreams table:', dreamsError);
      } else {
        console.log('Dreams table created successfully');
      }
    } else {
      console.log('Dreams table already exists');
    }

    // Create users table if it doesn't exist
    if (!existingTables.includes('users')) {
      console.log('Creating users table...');
      
      // Use SQL to create the table with appropriate types
      const { error: usersError } = await supabase.rpc('execute_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.users (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            email TEXT UNIQUE,
            created_at TEXT NOT NULL DEFAULT current_timestamp
          );
        `
      });
      
      if (usersError) {
        console.error('Error creating users table:', usersError);
      } else {
        console.log('Users table created successfully');
      }
    } else {
      console.log('Users table already exists');
    }

    console.log('Supabase setup completed');
  } catch (error) {
    console.error('Error during Supabase setup:', error);
  }
}

// Run the setup
setupTables();

export { setupTables };