
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Initialize the Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Create a standard supabase client with service role key
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

// Function to create a client with user's JWT from request headers
export const getSupabaseClient = (authHeader?: string) => {
  // If no auth header is provided, return the admin client
  if (!authHeader) {
    console.log('No auth header provided, using admin client');
    return supabaseAdmin;
  }
  
  try {
    // Extract JWT token from Authorization header
    // Format should be "Bearer TOKEN_VALUE"
    const token = authHeader.replace('Bearer ', '');
    
    if (!token || token === 'null' || token === 'undefined') {
      console.log('Invalid token in auth header, using admin client');
      return supabaseAdmin;
    }
    
    console.log('Creating client with user JWT token');
    // Create a new client with the user's JWT
    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  } catch (error) {
    console.error('Error creating client with auth header:', error);
    return supabaseAdmin;
  }
};
