import { supabase } from './supabase';

async function setupTables(): Promise<boolean> {
  try {
    console.log('Starting Supabase setup...');

    // Since we're using Supabase, we won't try to create tables directly
    // as that typically requires database admin privileges
    // Instead, check if tables exist and log the results
    
    // Check if tables exist by trying to select from them
    const { data: dreams, error: dreamsError } = await supabase
      .from('dreams')
      .select('id')
      .limit(1);
      
    let dreamsTableExists = false;
    if (dreamsError) {
      console.log('Dreams table may not exist yet:', dreamsError.message);
      console.log('Please create a "dreams" table in your Supabase project with the following structure:');
      console.log(`
        - id: serial primary key
        - title: text (not null)
        - description: text (not null)
        - image_url: text (not null)
        - style: text (not null)
        - mood: text (not null)
        - elements: text array
        - is_favorite: boolean (default false)
        - user_id: integer (optional)
        - created_at: text (not null, default current timestamp)
      `);
    } else {
      console.log('Dreams table exists');
      dreamsTableExists = true;
    }
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
      
    let usersTableExists = false;
    if (usersError) {
      console.log('Users table may not exist yet:', usersError.message);
      console.log('Please create a "users" table in your Supabase project with the following structure:');
      console.log(`
        - id: serial primary key
        - username: text (not null, unique)
        - password: text (not null)
        - email: text (unique)
        - created_at: text (not null, default current timestamp)
      `);
    } else {
      console.log('Users table exists');
      usersTableExists = true;
    }
    
    console.log('Supabase setup check completed');
    
    // Return true only if both tables exist
    return dreamsTableExists && usersTableExists;
  } catch (error) {
    console.error('Error checking Supabase tables:', error);
    return false;
  }
}

// Run the setup
setupTables();

export { setupTables };